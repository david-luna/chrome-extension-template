<script lang="ts">
  import { tabMode, status } from './store';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
</script>


<Header />
<section class="content">
  Hello world!
</section>
<Footer />

<style>
  *, *::before, *::after {
    font-family: var(--texts-family);
    font-size: var(--texts-body-base-size);
  }

  .content {
    background-color: #fff;
    flex: auto;
    max-height: 505px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>