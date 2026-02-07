import { Scope } from "./types";
import type { ActionConfig, ScopeValue } from "./types";

export class ActionDefinition {
  private _config: ActionConfig;

  constructor () {
    this._config = {
      variant: "default",
      hidden: false,
      validate: false,
      scopes: null,
    };
  }

  icon (i: string): this {
    this._config.icon = i;
    return this;
  }

  primary (): this {
    this._config.variant = "primary";
    return this;
  }

  destructive (): this {
    this._config.variant = "destructive";
    return this;
  }

  secondary (): this {
    this._config.variant = "secondary";
    return this;
  }

  muted (): this {
    this._config.variant = "muted";
    return this;
  }

  accent (): this {
    this._config.variant = "accent";
    return this;
  }

  success (): this {
    this._config.variant = "success";
    return this;
  }

  warning (): this {
    this._config.variant = "warning";
    return this;
  }

  info (): this {
    this._config.variant = "info";
    return this;
  }

  validate (v = true): this {
    this._config.validate = v;
    return this;
  }

  hidden (h = true): this {
    this._config.hidden = h;
    return this;
  }

  scopes (...s: ScopeValue[]): this {
    this._config.scopes = s;
    return this;
  }

  excludeScopes (...s: ScopeValue[]): this {
    const all = Object.values(Scope);
    this._config.scopes = all.filter((scope) => !s.includes(scope));
    return this;
  }

  toConfig (): ActionConfig {
    return { ...this._config };
  }
}

export function action (): ActionDefinition {
  return new ActionDefinition();
}
