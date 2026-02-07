import type { FieldConfig } from "@anhanga/core";

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const digits = (n: number) => Array.from({ length: n }, () => rand(0, 9)).join("");

const firstNames = ["Ana", "Carlos", "Maria", "João", "Fernanda", "Pedro", "Juliana", "Lucas", "Beatriz", "Rafael"];
const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Costa", "Ferreira", "Almeida", "Rodrigues"];
const streets = ["Rua das Flores", "Av. Paulista", "Rua XV de Novembro", "Av. Brasil", "Rua Augusta", "Rua da Consolação"];
const cities = ["São Paulo", "Rio de Janeiro", "Curitiba", "Belo Horizonte", "Porto Alegre", "Salvador", "Fortaleza"];
const domains = ["gmail.com", "hotmail.com", "empresa.com.br", "outlook.com"];

function fakeName() {
  return `${pick(firstNames)} ${pick(lastNames)}`;
}

function fakeEmail() {
  const first = pick(firstNames).toLowerCase();
  const last = pick(lastNames).toLowerCase();
  return `${first}.${last}${rand(1, 99)}@${pick(domains)}`;
}

function fakePhone() {
  return `(${digits(2)}) 9${digits(4)}-${digits(4)}`;
}

function fakeCpf() {
  return `${digits(3)}.${digits(3)}.${digits(3)}-${digits(2)}`;
}

function fakeCnpj() {
  return `${digits(2)}.${digits(3)}.${digits(3)}/${digits(4)}-${digits(2)}`;
}

function fakeCep() {
  return `${digits(5)}-${digits(3)}`;
}

function fakeUrl() {
  return `https://www.${pick(lastNames).toLowerCase()}.com.br`;
}

const textKindGenerators: Record<string, () => string> = {
  email: fakeEmail,
  phone: fakePhone,
  cpf: fakeCpf,
  cnpj: fakeCnpj,
  cep: fakeCep,
  url: fakeUrl,
  street: () => `${pick(streets)}, ${rand(1, 2000)}`,
  city: () => pick(cities),
};

const componentGenerators: Record<string, (config: FieldConfig) => unknown> = {
  text(config) {
    if (config.kind && textKindGenerators[config.kind]) {
      return textKindGenerators[config.kind]();
    }
    return fakeName();
  },
  number(config) {
    const min = config.validations.find((v) => v.rule === "min")?.params?.value as number | undefined;
    const max = config.validations.find((v) => v.rule === "max")?.params?.value as number | undefined;
    const precision = config.attrs.precision as number | undefined;
    const value = rand(min ?? 0, max ?? 1000);
    if (precision) {
      return Number((value + Math.random()).toFixed(precision));
    }
    return value;
  },
  currency() {
    return Number((rand(10, 10000) + Math.random()).toFixed(2));
  },
  date() {
    const year = rand(1980, 2005);
    const month = String(rand(1, 12)).padStart(2, "0");
    const day = String(rand(1, 28)).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
  datetime() {
    const year = rand(2020, 2026);
    const month = String(rand(1, 12)).padStart(2, "0");
    const day = String(rand(1, 28)).padStart(2, "0");
    const hour = String(rand(0, 23)).padStart(2, "0");
    const min = String(rand(0, 59)).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${min}`;
  },
  toggle() {
    return Math.random() > 0.5;
  },
  checkbox() {
    return Math.random() > 0.5;
  },
};

export function fakeValue(config: FieldConfig): unknown {
  const generator = componentGenerators[config.component];
  if (generator) return generator(config);
  return undefined;
}

export function fakeAll(
  fields: Record<string, FieldConfig>,
  identity?: string | string[],
): Record<string, unknown> {
  const identityKeys = identity
    ? Array.isArray(identity) ? identity : [identity]
    : [];
  const result: Record<string, unknown> = {};
  for (const [name, config] of Object.entries(fields)) {
    if (identityKeys.includes(name)) continue;
    const value = fakeValue(config);
    if (value !== undefined) {
      result[name] = value;
    }
  }
  return result;
}
