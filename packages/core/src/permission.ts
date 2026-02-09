export function isScopePermitted (
  domain: string,
  scope: string,
  permissions: string[] | undefined,
): boolean {
  if (permissions === undefined) return false;
  return permissions.includes(`${domain}.${scope}`);
}
