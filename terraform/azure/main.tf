provider "azurerm" {
  features {}
  use_oidc = true
  subscription_id    = var.subscription_id
  tenant_id          = var.tenant_id
  client_id          = var.client_id
}

terraform {
  backend "azurerm" {
    resource_group_name  = "mccntfrg"
    storage_account_name = "mccntfstatebucket"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

data "azurerm_client_config" "current" {}


resource "azurerm_resource_group" "rg" {
  name     = "${var.project_prefix}-rg"
  location = var.azure_location
}

resource "azurerm_storage_account" "static_site" {
  name                     = "${var.project_prefix}storage"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  static_website {
    index_document = "index.html"
    error_404_document = "error.html"
  }
  blob_properties {
    cors_rule {
      allowed_headers    = ["*"] # Allow all headers
      allowed_methods    = ["GET", "POST"] # Methods
      allowed_origins    = ["*"] # Allow all origins, or specify your domain: ["https://yourdomain.com", "http://localhost:3000"]
      exposed_headers    = ["*"] # Expose all headers
      max_age_in_seconds = 30   # Cache preflight requests for 5 minutes
    }
  }
}

/*resource "azurerm_storage_account" "queue" {
  name                     = "${var.project_prefix}queue"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
} */

resource "azurerm_storage_blob" "index_html" {
  name                   = "index.html"
  storage_account_name   = azurerm_storage_account.static_site.name
  storage_container_name = "$web"
  type                   = "Block"
  source                 = "${path.module}/../../static-website/index.html"
  content_type           = "text/html"
}

resource "azurerm_storage_blob" "error_html" {
  name                   = "error.html"
  storage_account_name   = azurerm_storage_account.static_site.name
  storage_container_name = "$web"
  type                   = "Block"
  source                 = "${path.module}/../../static-website/error.html"
  content_type           = "text/html"
}


resource "azurerm_storage_blob" "app_js" {
  name                   = "app.js"
  storage_account_name   = azurerm_storage_account.static_site.name
  storage_container_name = "$web"
  type                   = "Block"
  source                 = "${path.module}/../../static-website/app.js"
  content_type           = "application/javascript"
}


resource "azurerm_storage_blob" "config_js" {
  name                   = "config.js"
  storage_account_name   = azurerm_storage_account.static_site.name
  storage_container_name = "$web"
  type                   = "Block"
  content_type           = "application/javascript"
  source_content = <<EOT
window._env_ = {
  API_ENDPOINT_URL: "https://multiccn-fetchsummary.azurewebsites.net/api/tssummary"
};
EOT
}

resource "azurerm_storage_queue" "notification" {
  name                 = "js-queue-items"
  storage_account_name       = azurerm_storage_account.func_storage.name
  #storage_account_name = azurerm_storage_account.queue.name
}

# Cosmos DB Account
resource "azurerm_cosmosdb_account" "cosmos" {
  name                = "${var.project_prefix}-cosmosdb"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless" # Serverless mode (no RU/s)
  }

  #enable_free_tier = true

  tags = {
    Environment = "Development"
  }
}

# Cosmos DB SQL Database
resource "azurerm_cosmosdb_sql_database" "database" {
  name                = "mccndb"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
}

# Container: custReview
resource "azurerm_cosmosdb_sql_container" "cust_review" {
  name                = "customerReviews"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
  database_name       = azurerm_cosmosdb_sql_database.database.name
  partition_key_paths  = ["/id"]
  throughput          = null # Serverless, so no fixed throughput
}

# Container: sentAnalysis
resource "azurerm_cosmosdb_sql_container" "sent_analysis" {
  name                = "reviewSummary"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
  database_name       = azurerm_cosmosdb_sql_database.database.name
  partition_key_paths  = ["/id"]
  throughput          = null
}

data "azurerm_role_definition" "user_access_admin" {
  name  = "User Access Administrator"
  scope = "/subscriptions/${data.azurerm_client_config.current.subscription_id}"
}


resource "azurerm_role_assignment" "sentiment_cosmosdb_access" {
  scope                = azurerm_resource_group.rg.id #azurerm_cosmosdb_account.cosmos.id
  role_definition_name = "Cosmos DB Operator"
  #role_definition_id   = data.azurerm_role_definition.user_access_admin.id
  principal_id         = azurerm_windows_function_app.sentimentAnalyzer.identity[0].principal_id
}

resource "azurerm_role_assignment" "fetchsummary_cosmosdb_access" {
  scope                = azurerm_resource_group.rg.id  #azurerm_cosmosdb_account.cosmos.id
  role_definition_name = "Cosmos DB Operator"
  #role_definition_id   = data.azurerm_role_definition.user_access_admin.id
  principal_id         = azurerm_windows_function_app.fetchSummary.identity[0].principal_id
}

resource "azurerm_role_assignment" "queue_send_permission" {
  scope                = azurerm_storage_account.func_storage.id
  role_definition_name = "Storage Queue Data Contributor"
  principal_id         = azurerm_windows_function_app.sentimentAnalyzer.identity[0].principal_id
}

resource "azurerm_role_assignment" "queue_notify_permission" {
  scope                = azurerm_storage_account.func_storage.id
  role_definition_name = "Storage Queue Data Contributor"
  principal_id         = azurerm_windows_function_app.sendNotification.identity[0].principal_id
}

resource "azurerm_api_management" "apim" {
  name                = "${var.project_prefix}-apim"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  publisher_name      = "admin@myapp.com"
  publisher_email     = "admin@myapp.com"
  sku_name            = "Consumption_0"
}

# Define the API Management Backend resource
resource "azurerm_api_management_backend" "app_service_backend" {
  name                = "fetchSummaryBackend"
  resource_group_name = azurerm_resource_group.rg.name
  api_management_name = azurerm_api_management.apim.name
  protocol            = "http" # Or "https" depending on your backend
  url                 = "https://${azurerm_windows_function_app.fetchSummary.default_hostname}/api/tssummary" # Use the host name of the App Service
  description         = "Backend for fetch summary Service"
}

resource "azurerm_api_management_api" "summary_api" {
  name                = "summary-api"
  resource_group_name = azurerm_resource_group.rg.name
  api_management_name = azurerm_api_management.apim.name
  revision            = "1"
  display_name        = "Summary API"
  path                = "summary"
  protocols           = ["https"]

}

# Define the api operation
resource "azurerm_api_management_api_operation" "summary_post" {
  operation_id        = "post-summary"
  api_name            = azurerm_api_management_api.summary_api.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = azurerm_resource_group.rg.name
  display_name        = "Post Summary"
  method              = "POST"
  url_template        = "/${var.project_prefix}-fetchsummary"
  response {
    status_code = 200
    description = "OK"
  }
  request {
    description = "Request body"
    #query_parameters = []
    representation {
      content_type = "application/json" 
      #example = "{\"key\": \"value\"}"
    }
  }
}

resource "azurerm_api_management_api_operation_policy" "summary_post_cors" {
  api_name            = azurerm_api_management_api.summary_api.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = azurerm_resource_group.rg.name
  operation_id        = "post-summary"  # azurerm_storage_account.static_site.primary_web_host #<set-backend-service base-url="https://${azurerm_windows_function_app.fetchSummary.default_hostname}/api/tssummary" />
  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <cors allow-credentials="true">
      <allowed-origins>
        <origin>"https://multiccnstorage.z9.web.core.windows.net"</origin>
      </allowed-origins>
      <allowed-methods>
        <method>POST</method>
        <method>OPTIONS</method>
      </allowed-methods>
      <allowed-headers>
        <header>*</header>
      </allowed-headers>
    </cors>
    <set-backend-service backend-id="${azurerm_api_management_backend.app_service_backend.name}" />
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <base />
  </outbound>
</policies>
XML
  depends_on = [
    azurerm_api_management_api_operation.summary_post
  ]
}

