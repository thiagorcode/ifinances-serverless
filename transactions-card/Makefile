.PHONY: build-CreateCardTransactionFunction build-FindCardTransactionFunction build-FindByUserIdCardTransactionFunction build-FindAllCardTransactionFunction 
.PHONY: build-UpdateCardTransactionFunction
.PHONY: build-RuntimeDependenciesLayer build-lambda-common 

build-CreateCardTransactionFunction:
	$(MAKE) HANDLER=src/handlers/create.ts build-lambda-common

build-FindCardTransactionFunction:
	$(MAKE) HANDLER=src/handlers/find.ts build-lambda-common

build-FindByUserIdCardTransactionFunction:
	$(MAKE) HANDLER=src/handlers/findByUserId.ts build-lambda-common

build-FindAllCardTransactionFunction:
	$(MAKE) HANDLER=src/handlers/findAll.ts build-lambda-common

build-DeleteCardTransactionFunction:
	$(MAKE) HANDLER=src/handlers/delete.ts build-lambda-common

build-UpdateCardTransactionFunction:
	$(MAKE) HANDLER=src/handlers/update.ts build-lambda-common


build-lambda-common:
	npm install
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	npm run build -- --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --silent --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes aren't related to dependencies
	rm -rf "$(ARTIFACTS_DIR)/nodejs/node_modules/aws-sdk"

build-deploy-common:
	sam build -t services-transactions.yml
	cp -r ./samconfig.toml .aws-sam/build
	$(eval PARAMS := $(shell cat "params.$(env).json" | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]'))
	cd .aws-sam/build && sam deploy --on-failure DELETE --region sa-east-1 --parameter-overrides $(PARAMS) --config-env dev