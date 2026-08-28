# ADR 0003: Open-license remote photography with local fallback

- Status: Accepted for the demonstration bundle
- Date: 2026-08-26

## Decision

Load 1600-pixel Wikimedia Commons derivatives directly in the visitor browser, display creator/license attribution, and switch to an original local SVG if a request fails.

## Why

The authoring environment could not fetch and redistribute image bytes, while Commons provides stable source pages and explicit licenses. Direct loading keeps the code bundle small and attribution auditable.

## Consequences

The browser makes a request to Wikimedia, which is disclosed on the privacy page. A commercial launch should review each license and may mirror approved derivatives to a controlled asset pipeline while preserving attribution.
