import type { i18n as I18nInstance, TFunction } from "i18next";

/**
 * Resolves a field label supporting both flat and nested i18n structures.
 *
 * Flat (legacy):  `{domain}.fields.{name}` → 'Nome'
 * Nested (new):   `{domain}.fields.{name}.label` → 'Nome'
 */
export function resolveFieldLabel(
  i18n: I18nInstance,
  t: TFunction,
  domain: string,
  name: string,
): string {
  const nestedKey = `${domain}.fields.${name}.label`;
  if (i18n.exists(nestedKey)) {
    return t(nestedKey);
  }
  return t(`${domain}.fields.${name}`, { defaultValue: name });
}

/**
 * Resolves a field option label supporting both flat and nested i18n structures.
 *
 * Flat (legacy):  `{domain}.fields.{name}.{opt}` → 'Administrador'
 * Nested (new):   `{domain}.fields.{name}.options.{opt}` → 'Administrador'
 */
export function resolveFieldOption(
  i18n: I18nInstance,
  t: TFunction,
  domain: string,
  name: string,
  opt: string,
): string {
  const nestedKey = `${domain}.fields.${name}.options.${opt}`;
  if (i18n.exists(nestedKey)) {
    return t(nestedKey);
  }
  return t(`${domain}.fields.${name}.${opt}`, { defaultValue: opt });
}

/**
 * Resolves a field placeholder supporting both flat and nested i18n structures.
 *
 * Flat (legacy):  `{domain}.placeholders.{name}` → 'e.g. ...'
 * Nested (new):   `{domain}.fields.{name}.placeholder` → 'e.g. ...'
 */
export function resolveFieldPlaceholder(
  i18n: I18nInstance,
  t: TFunction,
  domain: string,
  name: string,
): string | undefined {
  if (i18n.exists(`${domain}.fields.${name}.placeholder`)) {
    return t(`${domain}.fields.${name}.placeholder`);
  }
  if (i18n.exists(`${domain}.placeholders.${name}`)) {
    return t(`${domain}.placeholders.${name}`);
  }
  return undefined;
}

/**
 * Resolves a field description supporting both flat and nested i18n structures.
 *
 * Flat (legacy):  `{domain}.descriptions.{name}` → 'Descrição...'
 * Nested (new):   `{domain}.fields.{name}.description` → 'Descrição...'
 */
export function resolveFieldDescription(
  i18n: I18nInstance,
  t: TFunction,
  domain: string,
  name: string,
): string | undefined {
  if (i18n.exists(`${domain}.fields.${name}.description`)) {
    return t(`${domain}.fields.${name}.description`);
  }
  if (i18n.exists(`${domain}.descriptions.${name}`)) {
    return t(`${domain}.descriptions.${name}`);
  }
  return undefined;
}
