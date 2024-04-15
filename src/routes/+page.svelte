<script>
    import field from '../assets/field.png';
    import Papa from 'papaparse';
    import Players from '$lib/players';
    import Player from '$lib/player';
    import { onMount } from 'svelte';
    import oracle from '../assets/oracle.png';

    /**
     * @type {Player[]}
     */
    let displayedList = [];
    let roster = Array.from({ length: 11 }, () => new Player("", 0, 0, "", 0, ""));
    let benchRoster = Array.from({ length: 4 }, () => new Player("", 0, 0, "", 0, ""));
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
   * @type {any[]}
   */
    let benchSelectedRoster = [];

    /**
   * @param {Player} player
   */
    function onSelect(player) {
        if (selectedRoster.indexOf(player) != -1) {
            // Roster already has player, remove them
            selectedRoster = selectedRoster.filter(e => e !== player);
            budget += +player.get_price();
            points -= +player.get_points();
            for (let i = 0; i < roster.length; i++) {
                if (roster[i] === player) roster[i] = new Player("", 0, 0, "", 0, "");
            }
        } else if (benchSelectedRoster.indexOf(player) != -1) {
            return;
        } else {
            // Roster does not have player, add them
            addToRoster(player);
        }
        // console.log(selectedRoster);
    }

    /**
   * @param {Player} player
   */
    function onBenchSelect(player) {
        if (benchSelectedRoster.indexOf(player) != -1) {
            benchSelectedRoster = benchSelectedRoster.filter(e => e !== player);
            budget += +player.get_price();
            for (let i = 0; i < benchRoster.length; i++) {
                if (benchRoster[i] === player) benchRoster[i] = new Player("", 0, 0, "", 0, "");
            }
        } else if (selectedRoster.indexOf(player) != -1) {
            return;
        } else {
            let added = false;
            for (let i = 0; i < 4; i++) {
                if (benchRoster[i].get_price() === 0) {
                    benchRoster[i] = player;
                    added = true;
                    break;
                }
            }
            if (added) {
                benchSelectedRoster.push(player);
                budget -= +player.get_price();
            }
        }
    }

    let stats_player = new Player("", 0, 0, "", 0, "");
    /**
   * @param {Player} player
   */
    function onStats(player) {
        let index = player.get_index();
        console.log(players.getStats(index));
        stats_player = player;
        stats = players.getStats(index);
        let clubName = player.get_team();
        switch (clubName) {
            case "Newcastle United":
                club = "Newcastle-United-logo";
                break;
            case "Liverpool":
                club = "Liverpool-FC-logo";
                break;
            case "Arsenal":
                club = "Arsenal-FC-logo";
                break;
            case "Brentford":
                club = "Brentford-FC-logo";
                break;
            case "Aston Villa":
                club = "Aston-Villa-FC-logo";
                break;
            case "B & H Albion":
                club = "Brighton-Hove-Albion-logo";
                break;
            case "Man United":
                club = "Manchester-United-FC-logo";
                break;
            case "Fulham":
                club = "Fulham-FC-logo";
                break;
            case "Wolverhampton":
                club = "Wolverhampton-Wanderers-logo";
                break;
            case "Everton-FC-logo":
                club = "Arsenal-FC-logo";
                break;
            case "Tottenham":
                club = "Tottenham-Hotspur-logo";
                break;
            case "Crystal Palace":
                club = "Crystal-Palace-FC-logo";
                break;
            case "West Ham":
                club = "West-Ham-United-FC-logo";
                break;
            case "Chelsea":
                club = "Chelsea-FC-logo";
                break;
            case "Man City":
                club = "Manchester-City-FC-logo";
                break;
            case "Bournemouth":
                club = "AFC-Bournemouth-logo";
                break;
            case "Nottingham Forest":
                club = "Nottingham-Forest-FC-logo";
                break;
            case "Sheffield United":
                club = "sheffield";
                break;
            case "Luton":
                club = "luton";
                break;
            case "Burnley":
                club = "Burnley-logo";
                break;
            case "Everton":
                club = "Everton-FC-logo";
                break;
            default:
                club = "premier";
                break;
        }
    }

    /**
     * Helper function to add player to the selected roster
   * @param {Player} player
   */
    function addToRoster(player) {
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
        
        let added = false;
        for (let i = spots[0]; i < spots[1]; i++) {
            if (roster[i].get_price() === 0) {
                roster[i] = player;
                added = true;
                break;
            }
        }
        if (added) {
            selectedRoster.push(player);
            budget -= +player.get_price();
            points += +player.get_points();
        }
    }

    function onRunAlgo() {
        let ready = false;
        for (let i = 0; i < selectedRoster.length; i++) {
            if (selectedRoster[i].get_group() == 2) {
                ready = true;
                break;
            }
        }
        if (ready) {
            let additions = players.getBest(selectedRoster, budget);
            for (let i in additions[0][2]) {
                console.log(additions[0][2][i]);
                let player = Object.assign(new Player("", 0, 0, "", 0, ""), additions[0][2][i]);
                let copiedPlayer = players.getPlayer(player.name);
                addToRoster(copiedPlayer);
            }
        } else {
            console.log('Conditions have not been met for algorithm run. Try selecting at least one midfielder.');
        }
    }

    let budget = 100;
    let points = 0;
    let stats = Array(80).fill("");
    stats[1] = "Select the chart to view a player's stats";
    let club = "premier";
</script>

<div class="container">
    <img alt="football field" src={field} /> 
    <h1 class="budget">Budget Left</h1>
    <div class="budget-div">
        <h2>{budget.toFixed(2)}</h2>
    </div>

    <h1 class="bench-title">Bench</h1>

    <h1 class="points">Potential Points</h1>
    <div class="points-div">
        <h2>{points}</h2>
    </div>
    {#each roster as player, i}
        <div class="player player-{i}">
            <div class="name">{player.name ?? ""}</div>
            <div class="team">{player.team ?? ""}</div>
        </div>
    {/each}
    {#each benchRoster as player, i}
        <div class="bench-player bench-player-{i}">
            <div class="bench-name">{player.name ?? ""}</div>
            <div class="bench-team">{player.team ?? ""}</div>
        </div>
    {/each}
</div>

<button class="run-algo" on:click={onRunAlgo}>
    Forsee the Best Path
</button>

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
    <th>...</th>
  {#each currentPageRows as row, i}
    <tr>
        <td class="table-name">{row.name}</td>
        <td>{row.points}</td>
        <td>{row.price}</td>
        <td>{row.team}</td>
        {#if roster.indexOf(row) != -1}
            <td>
                <button class="pick selected" on:click={() => {onSelect(row)}}>-</button>
                {#if benchRoster.indexOf(row) != -1}
                <button class="bench selected" on:click={() => {onBenchSelect(row)}}>🧍‍♂️</button>
                {:else}
                <button class="bench" on:click={() => {onBenchSelect(row)}}>🪑</button>
                {/if}
            </td>
        {:else}
            <td>
                <button class="pick" on:click={() => {onSelect(row)}}>+</button>
                {#if benchRoster.indexOf(row) != -1}
                <button class="bench selected" on:click={() => {onBenchSelect(row)}}>🧍‍♂️</button>
                {:else}
                <button class="bench" on:click={() => {onBenchSelect(row)}}>🪑</button>
                {/if}
            </td>
        {/if}
        {#if row === stats_player}
        <td>
            <button class="stats selected" on:click={() => {onStats(row)}}>📊</button>
        </td>
        {:else}
        <td>
            <button class="stats" on:click={() => {onStats(row)}}>📊</button>
        </td>
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

<img class="club" src="src/assets/{club}.png" alt="club logo" />
<img class="logo" src={oracle} alt="Fantasy Oracle logo" />

<div class="stats-container">
    <h1 class="stats-name">{stats[1]}</h1>
    <h2 class="stats-position">Position: {stats[2]}</h2>
    <h2 class="stats-num">Total Points: {stats[11]}</h2>
    <h2 class="stats-num">Price: {stats[5]}</h2>
    <table width="100%">
        <th>Picked %</th>
        <th>Total Points Percentile</th>
        <th>Value</th>
        <th>Points per game (PPG)</th>
        <th>PPG Percentile</th>
        <th>Points per million (PPM)</th>
        <th>PPM Percentile</th>
        <tr>
            <td>{stats[8]}</td>
            <td>{stats[12]}</td>
            <td>{stats[6]}</td>
            <td>{stats[13]}</td>
            <td>{stats[14]}</td>
            <td>{stats[15]}</td>
            <td>{stats[16]}</td>
        </tr>
    </table>
    <table width="100%">
        <th>Goals</th>
        <th>Goals Percentile</th>
        <th>Assists</th>
        <th>Assists Percentile</th>
        <th>Clean Sheets</th>
        <th>Clean Sheets Percentile</th>
        <th>Goals Conceded</th>
        <th>Goals Conceded Percentile</th>
        <tr>
            <td>{stats[21]}</td>
            <td>{stats[22]}</td>
            <td>{stats[23]}</td>
            <td>{stats[24]}</td>
            <td>{stats[25]}</td>
            <td>{stats[26]}</td>
            <td>{stats[27]}</td>
            <td>{stats[28]}</td>
        </tr>
    </table>
    <table width="100%">
        <th>Own Goals</th>
        <th>Own Goals Percentile</th>
        <th>Penalty Saved</th>
        <th>Penalty Saved Percentile</th>
        <th>Penalty Made</th>
        <th>Penalty Made Percentile</th>
        <tr>
            <td>{stats[29]}</td>
            <td>{stats[30]}</td>
            <td>{stats[31]}</td>
            <td>{stats[32]}</td>
            <td>{stats[33]}</td>
            <td>{stats[34]}</td>
        </tr>
    </table>
    <table width="100%">
        <th>Yellows</th>
        <th>Yellows Percentile</th>
        <th>Reds</th>
        <th>Reds Percentile</th>
        <th>Saves</th>
        <th>Saves Percentile</th>
        <th>Bonus Points</th>
        <th>Bonus Points Percentile</th>
        <tr>
            <td>{stats[35]}</td>
            <td>{stats[36]}</td>
            <td>{stats[37]}</td>
            <td>{stats[38]}</td>
            <td>{stats[39]}</td>
            <td>{stats[40]}</td>
            <td>{stats[41]}</td>
            <td>{stats[42]}</td>
        </tr>
    </table>
    <table width="100%">
        <th>Influence</th>
        <th>Influence Percentile</th>
        <th>Creativity</th>
        <th>Creativity Percentile</th>
        <th>Threat</th>
        <th>Threat Percentile</th>
        <th>ICT Index</th>
        <th>ICT Percentile</th>
        <tr>
            <td>{stats[45]}</td>
            <td>{stats[46]}</td>
            <td>{stats[47]}</td>
            <td>{stats[48]}</td>
            <td>{stats[49]}</td>
            <td>{stats[50]}</td>
            <td>{stats[51]}</td>
            <td>{stats[52]}</td>
        </tr>
    </table>

    <table width="100%">
        <th>Wk 1</th>
        <th>Wk 2</th>
        <th>Wk 3</th>
        <th>Wk 4</th>
        <th>Wk 5</th>
        <th>Wk 6</th>
        <th>Wk 7</th>
        <th>Wk 8</th>
        <th>Wk 9</th>
        <th>Wk 10</th>
        <th>Wk 11</th>
        <th>Wk 12</th>
        <th>Wk 13</th>
        <th>Wk 14</th>
        <tr>
            <td>{stats[79]}</td>
            <td>{stats[78]}</td>
            <td>{stats[77]}</td>
            <td>{stats[76]}</td>
            <td>{stats[75]}</td>
            <td>{stats[74]}</td>
            <td>{stats[73]}</td>
            <td>{stats[72]}</td>
            <td>{stats[71]}</td>
            <td>{stats[70]}</td>
            <td>{stats[69]}</td>
            <td>{stats[68]}</td>
            <td>{stats[67]}</td>
            <td>{stats[66]}</td>
        </tr>
    </table>
    <table width="100%">
        <th>Wk 15</th>
        <th>Wk 16</th>
        <th>Wk 17</th>
        <th>Wk 18</th>
        <th>Wk 19</th>
        <th>Wk 20</th>
        <th>Wk 21</th>
        <th>Wk 22</th>
        <th>Wk 23</th>
        <th>Wk 24</th>
        <th>Wk 25</th>
        <th>Wk 26</th>
        <th>Wk 27</th>
        <tr>
            <td>{stats[65]}</td>
            <td>{stats[64]}</td>
            <td>{stats[63]}</td>
            <td>{stats[62]}</td>
            <td>{stats[61]}</td>
            <td>{stats[60]}</td>
            <td>{stats[59]}</td>
            <td>{stats[58]}</td>
            <td>{stats[57]}</td>
            <td>{stats[56]}</td>
            <td>{stats[55]}</td>
            <td>{stats[54]}</td>
            <td>{stats[53]}</td>
        </tr>
    </table>
</div>

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