# ADR 0002: Procedural 3D as progressive enhancement

- Status: Accepted
- Date: 2026-08-26

## Decision

Build an original vehicle sculpture from Three.js primitives and vary its silhouette/material by selected car. Dynamically load it only in WebGL-capable browsers; keep all factual content in server-rendered HTML and provide a local SVG fallback.

## Why

Manufacturer-accurate 3D models add large payloads, licensing ambiguity and false visual precision. A procedural sculpture provides the requested 3D interaction while preserving performance, originality and reliability.

## Consequences

The stage must state that it is procedural, not a scanned vehicle. It cannot be used to judge exact dimensions or styling. Reduced-motion users receive a non-rotating demand-rendered scene.
