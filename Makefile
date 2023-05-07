.PHONY: dev build lint test

dev:
	@ # mkdir -p ~/.local/share/fonts
	@ # fc-cache ~/.local/share/fonts/
	@ glib-compile-schemas --strict ./data
	@ ./src/local.js

build:
	npm install
	cd troll && npm install

lint:
	./node_modules/.bin/eslint --max-warnings=0 .

test: lint
