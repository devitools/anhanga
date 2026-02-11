export function isScopePermitted (
  domain: string,
  scope: string,
  permissions: string[] | undefined,
): boolean {
  if (permissions === undefined) return false;
  return permissions.includes(`${domain}.scope.${scope}`);
}

export function isActionPermitted (
  domain: string,
  actionName: string,
  config: { open: boolean },
  permissions: string[] | undefined,
): boolean {
  if (config.open) return true;
  if (permissions === undefined) return false;
  return permissions.includes(`${domain}.action.${actionName}`);
}
