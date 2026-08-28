#!/usr/bin/env python3
"""Dependency-free structural, boundary and secret checks for the repository."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []
warnings: list[str] = []

required = [
    "README.md",
    "AGENTS.md",
    "package.json",
    "next.config.ts",
    "Dockerfile",
    "cloudbuild.yaml",
    "src/app/page.tsx",
    "src/app/globals.css",
    "src/app/compare/page.tsx",
    "src/app/methodology/page.tsx",
    "src/data/cars.json",
    "infra/terraform/main.tf",
    "docs/ARCHITECTURE.md",
    "docs/DESIGN_RESEARCH.md",
    "docs/GCP_DEPLOYMENT.md",
]
for relative_path in required:
    if not (ROOT / relative_path).exists():
        errors.append(f"missing required file: {relative_path}")

try:
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
except Exception as exc:
    errors.append(f"invalid package.json: {exc}")
    package = {}

for section in ("dependencies", "devDependencies"):
    for name, version in package.get(section, {}).items():
        if name.startswith("@types/"):
            continue
        if not re.fullmatch(r"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?", str(version)):
            errors.append(f"{section}.{name} must use an exact version, found {version!r}")

try:
    cars = json.loads((ROOT / "src/data/cars.json").read_text(encoding="utf-8"))
except Exception as exc:
    errors.append(f"invalid cars.json: {exc}")
    cars = []

if len(cars) != 10:
    errors.append(f"expected 10 cars, found {len(cars)}")
for car in cars:
    slug = car.get("slug", "")
    fallback = ROOT / f"public/images/fallback/{slug}.svg"
    if not fallback.exists():
        errors.append(f"missing fallback for {slug}")
    if not (ROOT / "src/app/cars/[slug]/page.tsx").exists():
        errors.append("missing dynamic car route")

text_extensions = {
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".json",
    ".md",
    ".tf",
    ".yaml",
    ".yml",
    ".css",
    ".svg",
}
secret_patterns = [
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"AIza[0-9A-Za-z_-]{35}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9]{30,}"),
]
for path in ROOT.rglob("*"):
    if not path.is_file() or path.suffix not in text_extensions or "node_modules" in path.parts:
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    if re.search(r"(?m)^(<<<<<<<|=======|>>>>>>>)", text):
        errors.append(f"merge marker: {path.relative_to(ROOT)}")
    for pattern in secret_patterns:
        if pattern.search(text):
            errors.append(f"possible secret: {path.relative_to(ROOT)}")

checks = {
    "Dockerfile": ["USER nextjs", "EXPOSE 8080", ".next/standalone"],
    "next.config.ts": ["Content-Security-Policy", "Strict-Transport-Security", "frame-ancestors 'none'"],
    "infra/terraform/main.tf": [
        "google_cloud_run_v2_service",
        "google_compute_region_network_endpoint_group",
        "google_compute_managed_ssl_certificate",
        "google_compute_security_policy",
    ],
    "infra/terraform/variables.tf": ["cultemergence.com"],
}
for relative_path, needles in checks.items():
    path = ROOT / relative_path
    if not path.exists():
        continue
    content = path.read_text(encoding="utf-8")
    for needle in needles:
        if needle not in content:
            errors.append(f"{relative_path} is missing required control: {needle}")

for path in [*ROOT.glob("infra/**/*.tf")]:
    content = path.read_text(encoding="utf-8")
    without_strings = re.sub(r'"(?:\\.|[^"\\])*"', '""', content)
    without_comments = re.sub(r"(?m)#.*$", "", without_strings)
    for opening, closing in (("{", "}"), ("[", "]"), ("(", ")")):
        if without_comments.count(opening) != without_comments.count(closing):
            errors.append(f"unbalanced {opening}{closing} in {path.relative_to(ROOT)}")

if not (ROOT / "package-lock.json").exists():
    warnings.append("package-lock.json is not present; generate and commit it after the first networked npm install")

if errors:
    print("Project structure verification FAIL")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print(f"Project structure verification PASS: {sum(1 for path in ROOT.rglob('*') if path.is_file())} files checked.")
for warning in warnings:
    print(f"WARNING: {warning}")
