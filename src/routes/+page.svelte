<script lang="ts">
  import * as Dialogue from '$components/ui/dialogue';
  import * as Loading from '$components/ui/loading';
  import * as Quiz from '$components/ui/quiz';
</script>

<Dialogue.Root class="relative top-0 left-0 h-screen w-screen overflow-hidden">
  <Dialogue.Error />

  <Loading.Root>
    {#snippet particles()}
      <Loading.Particles />
    {/snippet}
    <Loading.Bar>
      {#snippet quote()}
        <Loading.Quotes accessorKey="quote" />
      {/snippet}
      {#snippet author()}
        <Loading.Quotes accessorKey="name" />
      {/snippet}
    </Loading.Bar>
    <Loading.Continue />
  </Loading.Root>

  <Dialogue.Content>
    <Dialogue.Scenes />
  </Dialogue.Content>

  <!-- Quiz Interface System -->
  <Quiz.Root />
</Dialogue.Root>
