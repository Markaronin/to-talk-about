export AWS_ACCESS_KEY_ID=$(jq --raw-output '.AWS_ACCESS_KEY_ID' credentials.json)
export AWS_SECRET_ACCESS_KEY=$(jq --raw-output '.AWS_SECRET_ACCESS_KEY' credentials.json)
