<script>
  import '../app.css'
  import '$lib/presentation/components/renderers'

  let { children } = $props()
</script>

<div style="max-width: 900px; margin: 0 auto; padding: 16px;">
  {@render children()}
</div>
