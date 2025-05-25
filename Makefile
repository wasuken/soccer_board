.PHONY: fmt lint frontend-build precom

fmt:
	docker compose exec app npm run fmt

lint:
	docker compose exec app npm run lint

frontend-build:
	docker compose exec app npm run build

precom:
	make fmt
	make lint
	make frontend-build
