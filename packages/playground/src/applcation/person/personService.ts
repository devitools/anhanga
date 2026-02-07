export const personService = {
  async read () {
    console.log("[personService.read]");
    return {};
  },
  async create (_data: Record<string, unknown>) {
    console.log("[personService.create]", _data);
    return _data;
  },
  async update (_id: string, _data: Record<string, unknown>) {
    console.log("[personService.update]", _id, _data);
    return _data;
  },
  async destroy (_id: string) {
    console.log("[personService.destroy]", _id);
  },
  async custom (_name: string) {
    console.log("[personService.custom]", _name);
  },
};
