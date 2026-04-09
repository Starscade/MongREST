.PHONY: all start


%:

	@$(MAKE) --no-print-directory


all:

	@printf "\n"
	@printf "      \033[1mTARGETS\033[0m: start\n"
	@printf "\n"


start:

	@deno task start


