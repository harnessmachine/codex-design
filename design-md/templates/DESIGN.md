---
version: alpha
name: <Product> Design System
description: <one line: product, posture, density>
colors:
  primary: "<#hex>"
  surface: "<#hex>"
  on-surface: "<#hex>"
  muted: "<#hex>"
  line: "<#hex>"
typography:
  headline-lg:
    fontFamily: <family>
    fontSize: <px>
    fontWeight: <number>
    lineHeight: <unitless>
    letterSpacing: <em>
  body-md:
    fontFamily: <family>
    fontSize: <px>
    fontWeight: <number>
    lineHeight: <unitless>
  label-md:
    fontFamily: <family>
    fontSize: <px>
    fontWeight: <number>
    lineHeight: <unitless>
rounded:
  sm: <px>
  md: <px>
  full: 9999px
spacing:
  xs: <px>
  sm: <px>
  md: <px>
  lg: <px>
  xl: <px>
  container: <px>
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: <px>
  button-primary-hover:
    backgroundColor: "<#hex>"
  card:
    backgroundColor: "<#hex>"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
---

# <Product> Design System

## Overview

<Who it is for, the feel, density, one concrete visual reference. Two to four sentences.>

## Colors

- **Primary (<#hex>):** <role; where it is used; where it is not>
- **Surface (<#hex>):** <role>
- **On-surface (<#hex>):** <role; contrast against surface>

## Typography

<Families and why. One line per level: role, size, where.>

## Layout

<Grid unit (4/8px), container widths, columns per breakpoint, section rhythm.>

## Elevation & Depth

<Shadows or tonal layers; how hierarchy is shown.>

## Shapes

<Radius scale and where each level applies.>

## Components

<Each component present on the page: variants and states, which tokens.>

## Do's and Don'ts

- Do <rule from a decision>
- Don't <value that was merged away, and what to use instead>

## Provenance

- Measured: <pages> at <widths>, <date>.
- Observed vs decided: <which tokens the owner decided in the conflict review>.

## Open questions

- <anything the owner left open; code drift not yet fixed>
