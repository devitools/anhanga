import { configureIcons } from "@anhanga/sveltekit";
import { Eye, Pencil, Plus, Save, Send, Trash2, X } from "lucide-svelte";

configureIcons({
  common: {
    actions: {
      add: Plus,
      view: Eye,
      edit: Pencil,
      create: Save,
      update: Save,
      cancel: X,
      destroy: Trash2,
      custom: Send,
    },
  },
});
