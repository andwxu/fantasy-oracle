<script>
    import field from '../assets/field.png';
    import Papa from 'papaparse';
    import Players from '$lib/players';
    import Player from '$lib/player';
    import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

    /**
     * @type {Player[]}
     */
    let displayedList = [];
    let roster = Array.from({ length: 11 }, () => new Player("", 0, 0, "", 0, ""));
    const itemsPerPage = 30;
    /**
   * @type {Players}
   */
    let players;

    onMount(async () => {
        try {
            const response = await fetch('stats.csv');
            const csvData = await response.text();
            const results = Papa.parse(csvData, { header: false });
            const data = results.data;
            players = new Players(data);
            displayedList = players.getGks();
        } catch (error) {
            console.error('Error fetching or parsing CSV:', error);
        }

        paginate(displayedList);
    });

    let rows = [];
    let page = 0;
    /**
     * @type {string | any[]}
     */
    let totalPages = [];
    /**
   * @type {any[]}
   */
    let currentPageRows = [];
        
    $: currentPageRows = totalPages.length > 0 ? totalPages[page] : [];
    // $: console.log("Page is", page);

    const paginate = (/** @type {string | any[]} */ items) => {
        const pages = Math.ceil(items.length / itemsPerPage);

        const paginatedItems = Array.from({ length: pages }, (_, index) => {
            const start = index * itemsPerPage;
            return items.slice(start, start + itemsPerPage);
        });

        // console.log("paginatedItems are", paginatedItems);
        totalPages = [...paginatedItems];
    };

    const setPage = (/** @type {number} */ p) => {
		if (p >= 0 && p < totalPages.length) {
			page = p;
		}
	}

    let selected = 'GK';

    /**
   * @param {{ currentTarget: { value: any; }; }} event
   */
    function onChange(event) {
		selected = event.currentTarget.value;
        if (selected == 'GK') displayedList = players.getGks();
        else if (selected == 'DEF') displayedList = players.getDefs();
        else if (selected == 'MID') displayedList = players.getMids();
        else displayedList = players.getStrs();
        page = 0;
        paginate(displayedList);
	}

    /**
   * @type {any[]}
   */
    let selectedRoster = [];

    /**
   * @param {Player} player
   */
    function onSelect(player) {
        if (selectedRoster.indexOf(player) != -1) {
            selectedRoster = selectedRoster.filter(e => e !== player);
            for (let i = 0; i < roster.length; i++) {
                if (roster[i] === player) roster[i] = new Player("", 0, 0, "", 0, "");
            }
        } else {
            selectedRoster.push(player);
            let spots = [];
            if (player.get_group() === 0) {
                spots = [0, 1];
            } else if (player.get_group() === 1) {
                spots = [1, 4];
            } else if (player.get_group() === 2) {
                spots = [4, 8];
            } else {
                spots = [8, 11];
            }

            for (let i = spots[0]; i < spots[1]; i++) {
                if (roster[i].get_price() === 0) {
                    roster[i] = player;
                    break;
                }
            }
        }
        //console.log(selectedRoster);
    }
</script>

<div class="container">
    <img alt="football field" src={field} /> 
    {#each roster as player, i}
        <div class="player player-{i}">
            <div class="name">{player.name ?? ""}</div>
            <div class="team"></div>
        </div>
    {/each}
</div>

<div class="switch-field">
    <input type="radio" id="radio-three" on:change={onChange} name="switch-two" value="GK" checked/>
    <label for="radio-three">GK</label>
    <input type="radio" id="radio-four" on:change={onChange} name="switch-two" value="DEF" />
    <label for="radio-four">DEF</label>
    <input type="radio" id="radio-five" on:change={onChange} name="switch-two" value="MID" />
    <label for="radio-five">MID</label>
    <input type="radio" id="radio-six" on:change={onChange} name="switch-two" value="STR" />
    <label for="radio-six">STR</label>
</div>

<table class="player-table">
<tbody>
    <th>Name</th>
    <th>Points</th>
    <th>Price</th>
    <th>Club</th>
    <th>Pick</th>
  {#each currentPageRows as row, i}
    <tr>
        <td class="table-name">{row.name}</td>
        <td>{row.points}</td>
        <td>{row.price}</td>
        <td>{row.team}</td>
        {#if roster.indexOf(row) != -1}
            <td><button class="pick" on:click={() => {onSelect(row)}}>-
            </button></td>
        {:else}
            <td><button class="pick" on:click={() => {onSelect(row)}}>+
            </button></td>
        {/if}
    </tr>
  {:else}
    <tr>
      <td>
        <h5 class="text-center">There is no data to display here.</h5>
      </td>
    </tr>
  {/each}
</tbody>
</table>
<nav class="pagination">
    <ul>
    <li>
        <button type="button" class="btn-next-prev" on:click={() => setPage(page - 1)}>
            PREV
        </button>
    </li>

    {#each totalPages as currPage, i}
        <li>
            {#if i==page}
                <button type="button" class="btn-page-number selected" on:click={() => setPage(i)}>
                    {i + 1}
                </button>
            {:else}
            <button type="button" class="btn-page-number" on:click={() => setPage(i)}>
                {i + 1}
            </button>
            {/if}
        </li>
    {/each}

    <li>
        <button type="button" class="btn-next-prev" on:click={() => setPage(page + 1)}>
            NEXT
        </button>
    </li>
    </ul>
</nav>

<style>
    @import './+page.css';
</style>

<!-- <script>
    import field from '../assets/field.png';
    import Papa from 'papaparse';
    import * as fs from 'fs';
    import Players from '$lib/players';
    import Player from '$lib/player';
    import { onMount } from 'svelte';

    console.log('in script');
    var players;
    /**
     * @type {Array<Player>}
     */
    let displayedList;
    let roster = new Array();
    for (let i = 0; i < 11; i++) {
        roster[i] = new Player("", 0, 0, "", 0);
    }

    onMount(async () => {
        console.log('in onmount');
        try {
            const response = await fetch('./stats.csv');
            const csvData = await response.text();
            const results = Papa.parse(csvData, { header: true });
            const data = results.data;
            const players = new Players(data);
            displayedList = players.getGks();
        } catch (error) {
            console.error('Error fetching or parsing CSV:', error);
        }
    });

    // onMount(() => {
    //     console.log('in onmount');
    //     const file = fs.createReadStream('stats.csv');
    //     Papa.parse(file, {
    //         complete: function(/** @type {any} */ results) {
    //             var data = results.data;
    //             players = new Players(data);
    //             // players.getBest();
    //             let displayedList = players.getGks();
    //         }
    //     });
    // });
    
    // Papa.parse(file, {
    //     complete: function(/** @type {any} */ results) {
    //         var data = results.data;
    //         players = new Players(data);
    //         // players.getBest();
    //         let displayedList = players.getGks();
    //     }
    // });

</script>

<div class="container">
    <img alt="football field" src={field} /> 
    <div class="player player-0">
        <div class="name">{roster[0].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-1">
        <div class="name">{roster[1].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-2">
        <div class="name">{roster[2].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-3">
        <div class="name">{roster[3].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-4">
        <div class="name">{roster[4].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-5">
        <div class="name">{roster[5].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-6">
        <div class="name">{roster[6].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-7">
        <div class="name">{roster[7].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-8">
        <div class="name">{roster[8].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-9">
        <div class="name">{roster[9].name ?? ""}</div>
        <div class="team"></div>
    </div>
    <div class="player player-10">
        <div class="name">{roster[10].name ?? ""}</div>
        <div class="team"></div>
    </div>
</div>

{#if displayedList && displayedList.length > 0}
<div class="player-list">
    <ul>
    {#each displayedList as player}
        <li>{player.name}</li>
    {/each}
    </ul>
</div>
{/if}


<style>
    @import './+page.css';
</style> -->