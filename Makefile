.PHONY: install dev check test e2e build docker terraform-check
install:
\tnpm install

dev:
\tnpm run dev

check:
\tnpm run check

test:
\tnpm run test

e2e:
\tnpm run test:e2e

build:
\tnpm run build

docker:
\tdocker build -t cultemergence-cars:local .

terraform-check:
\tterraform -chdir=infra/terraform fmt -check -recursive
\tterraform -chdir=infra/terraform init -backend=false
\tterraform -chdir=infra/terraform validate
