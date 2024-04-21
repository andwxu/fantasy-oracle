import bestFullTeams from "./group_knapsack";
import Player from "./player";

export default class Players {
    full_list = new Array();
    gks = new Array();
    defs = new Array();
    mids = new Array();
    strs = new Array();
    full_stat = new Array();

    /**
     * @param {any} players
     */
    constructor(players) {
        for (let i in players) {
            if (+i < 2) continue;
            let p = new Player(players[i][1], players[i][5], players[i][11], players[i][2], +i-2, players[i][4]); 
            this.full_list.push(p);
            this.full_stat.push(players[i]);

            if (players[i][2] == "GK") this.gks.push(p);
            else if (players[i][2] == "DEF") this.defs.push(p);
            else if (players[i][2] == "MID") this.mids.push(p);
            else this.strs.push(p);
        }

        this.strs.pop();

        this.gks.sort((a, b) => b.points - a.points);
        this.defs.sort((a, b) => b.points - a.points);
        this.mids.sort((a, b) => b.points - a.points);
        this.strs.sort((a, b) => b.points - a.points);
    }

    /**
     * @param {any[]} selectedRoster
     * @returns {Array<Array<any>>}
     * @param {number} budget
     * @param {any[]} benchSelectedRoster
     */
    getBest(selectedRoster, benchSelectedRoster, budget) {
        let gk = 1;
        let def = 3;
        let mid = 4;
        let str = 3;

        let reduced_list = structuredClone(this.full_list);
        for (let i in selectedRoster) {
            if (selectedRoster[i].get_group() == 0) gk--;
            else if (selectedRoster[i].get_group() == 1) def--;
            else if (selectedRoster[i].get_group() == 2) mid--;
            else str--;

            reduced_list = reduced_list.filter(e => e.name !== selectedRoster[i].name);
        }
        for (let i in benchSelectedRoster) {
            reduced_list = reduced_list.filter(e => e.name !== benchSelectedRoster[i].name);
        }
        let possible_formations = [
            [Math.max(0, gk), Math.max(0, def), Math.max(0, mid), Math.max(0, str)]];

        console.log(possible_formations);
        let results = bestFullTeams(reduced_list, possible_formations, budget);
        return results;
    }

    getGks() {
        return this.gks;
    }

    getDefs() {
        return this.defs;
    }

    getMids() {
        return this.mids;
    }

    getStrs() {
        return this.strs;
    }

    /**
     * @param {Player} player
     */
    getPlayer(player) {
        for (let i in this.full_list) {
            if (this.full_list[i].get_name() == player.get_name() 
                && this.full_list[i].get_group() == player.get_group()
                && this.full_list[i].get_team() == player.get_team()) return this.full_list[i];
        }
        return null;
    }

    /**
     * @param {number} index
     */
    getStats(index) {
        console.log(this.full_stat);
        return this.full_stat[index];
    }
}