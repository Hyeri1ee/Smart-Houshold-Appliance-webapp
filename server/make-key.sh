#!/bin/bash
mkdir -p ./key
cd ./key
ssh-keygen -t rsa -b 4096 -m PEM -E SHA512 -f jwtRS512.key -N ""
PRIVATE_KEY=$(<jwtRS512.key)
PUBLIC_KEY=$(<jwtRS512.key.pub)
PRIVATE_KEY_ESCAPED=$(echo "$PRIVATE_KEY" | awk '{printf "%s\\n", $0}')
PUBLIC_KEY_ESCAPED=$(echo "$PUBLIC_KEY" | awk '{printf "%s\\n", $0}')
echo -e "PUBLIC_KEY=\"$PUBLIC_KEY_ESCAPED\"\nPRIVATE_KEY=\"$PRIVATE_KEY_ESCAPED\"" > ../src/jwt.env
