# Security policy

## Scope and current limitations

This repository is currently a static front-end prototype. The loyalty wallet stores customer records in browser `localStorage`; it has no authentication, server-side authorization, shared database, or trusted audit log. The guest pass and its QR code are generated client-side and must not be treated as secure credentials. Do not enter real customer information or use the prototype to authorize discounts, admission, or payments.

The Telegram bot integration in `wallet.html` sends requests directly from the browser using a token entered in the UI. A bot token exposed to a browser is not secret. Do not use a production bot token with this prototype.

## Reporting a vulnerability

Please do not publish personal data, bot tokens, or other secrets in an issue. Contact the repository owner privately with a description, reproduction steps, and the affected file/version. Rotate any credentials that may have been exposed.

## Production requirements

Before handling real customer data, move customer records and membership verification to a server-side system; enforce authentication and authorization on every sensitive operation; keep API secrets server-side; use HTTPS; and establish a privacy/retention policy and backups.
