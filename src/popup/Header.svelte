<script lang="ts">
  import { EventWithTarget } from '../types';

  function onInput(event: EventWithTarget<HTMLInputElement>) {
    console.log('search', event.currentTarget.value);
  }
</script>

<header class="popup-header">
  <input
    id="search"
    class="popup-header__input"
    placeholder="Search..."
    on:input={(event) => onInput(event)}
  />
</header>

<style>
  .popup-header {
    display: flex;
    align-items: stretch;
    background-color: #18165f;
  }

  .popup-header__input {
    width: 100%;
    border: none;
    background-color: #18165f;
    color: #fff;
  }
</style>

