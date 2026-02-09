import { Scope } from "./types";
import type { ActionConfig, PositionValue, ScopeValue } from "./types";
export class ActionDefinition {
  private readonly _config: ActionConfig;

  constructor () {
    this._config = {
      variant: "default",
      positions: [],
      align: "end",
      hidden: false,
      scopes: null,
      order: 0,
    };
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

  positions (...p: PositionValue[]): this {
    this._config.positions = p;
    return this;
  }

  start (): this {
    this._config.align = "start";
    return this;
  }

  end (): this {
    this._config.align = "end";
    return this;
  }

  order (o: number): this {
    this._config.order = o;
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
