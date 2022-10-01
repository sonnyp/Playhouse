.PHONY: build lint test

build:
	npm install
	cd troll && npm install

lint:
	./node_modules/.bin/eslint --max-warnings=0 ..

test: lint
