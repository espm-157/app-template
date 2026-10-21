BASE := nature.datahub.berkeley.edu
PORT := 8000

# Preview the app from the JupyterHub. Open the link this prints.
.PHONY: serve
serve:
	@echo "\n 🌎  preview at: \033[1m https://$(BASE)$(JUPYTERHUB_SERVICE_PREFIX)proxy/$(PORT)/ \033[0m \n"
	python -m http.server $(PORT) --directory web

.PHONY: test
test:
	pytest tests
