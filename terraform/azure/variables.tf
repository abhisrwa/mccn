variable "project_prefix" {
  description = "Prefix used to name Azure resources"
  type        = string
  default     = "multiccn"
}

variable "azure_location" {
  description = "Azure region"
  type        = string
  default     = "canadacentral"
}

variable "from_email_address" {
  description = "Sender email address for email notifications"
  type        = string
}

variable "to_email_address" {
  description = "The target email address in SendGrid."
  type        = string
  sensitive   = true
}

variable "azure_sendgrid_secret_name" {
  description = "Name of the secret in Azure Key Vault for the SendGrid API key"
  type        = string
  default     = "sendgridApikey"
}

variable "azure_sendgrid_secret_val" {
  description = "Value of the secret in Azure Key Vault for the SendGrid API key"
  type        = string
  default     = "123"
  
}

variable "azure_key_vault_name" {
  description = "The name for the Azure Key Vault."
  type        = string
  default     = "kvSGsecrets-mc" # Must be globally unique
}

variable "subscription_id" {
  type        = string
  description = "Azure Subscription ID"
}

variable "tenant_id" {
  type        = string
  description = "Azure Tenant ID"
}

variable "client_id" {
  type        = string
  description = "Azure client ID of the Federated Identity credential"
}

variable "openrouter_api_key" {
  description = "Open router Info."
  type        = string
  sensitive   = true
}