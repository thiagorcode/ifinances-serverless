.PHONY: build-ProcessReportsTransactionCategoryFunction build-ProcessReportsTransactionCardFunction build-ProcessReportsTransactionMonthlyFunction
.PHONY: build-UpdateTransactionFunction build-UpdateTransactionFunction build-FindReportMonthlyTransactionFunction build-FindReportCategoryTransactionFunction
.PHONY: build-RuntimeDependenciesLayer build-lambda-common 

build-ProcessReportsTransactionMonthlyFunction:
	$(MAKE) HANDLER=src/handlers/processReportsTransactionsMonthly.ts build-lambda-common

build-ProcessReportsTransactionCategoryFunction:
	$(MAKE) HANDLER=src/handlers/processReportsTransactionsCategory.ts build-lambda-common

build-ProcessReportsTransactionCardFunction:
	$(MAKE) HANDLER=src/handlers/processReportsTransactionsCard.ts build-lambda-common

build-FindReportMonthlyTransactionFunction:
	$(MAKE) HANDLER=src/handlers/findReportMonthly.ts build-lambda-common

build-FindReportCategoryTransactionFunction:
	$(MAKE) HANDLER=src/handlers/findReportCategory.ts build-lambda-common

build-lambda-common:
	npm install
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	HANDLER="${HANDLER}" node build.js
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --silent --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes aren't related to dependencies
	rm -rf "$(ARTIFACTS_DIR)/nodejs/node_modules/aws-sdk"

build-deploy-common:
	sam build -t services-transactions-reports.yml
	cp -r ./samconfig.toml .aws-sam/build
	$(eval PARAMS := $(shell cat "params.$(env).json" | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]'))
	cd .aws-sam/build && sam deploy --on-failure DELETE --region sa-east-1 --parameter-overrides $(PARAMS) --config-env dev