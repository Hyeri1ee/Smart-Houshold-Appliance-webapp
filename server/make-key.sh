#!/bin/bash
echo -e "JWT_KEY=\"$(openssl rand -base64 60)\"" > .env 