<script>
import "../app.css";
import "@anhanga/sveltekit/styles.css";
import "$lib/settings/icons";
import "$lib/settings/i18n-setup";

let { children } = $props();
</script>

<div style="max-width: 900px; margin: 0 auto; padding: 16px;">
  {@render children()}
</div>
