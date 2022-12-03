<template>
  <div ref="root" class="container mx-auto my-4 text-center">
    <h1 class="mb-8 break-after-page text-4xl">World Cup 2022 Group Stage</h1>
    <div class="grid grid-cols-1 gap-4">
      <div v-for="(data, group) in groups" class="break-after-page pb-2">
        <h2 class="text-2xl">{{ group }}</h2>
        <table class="js_results-table mt-8 w-full border-separate">
          <caption class="text-xl">
            Matches
          </caption>
          <thead>
            <tr>
              <th>Home</th>
              <th></th>
              <th>Away</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="fixture in fixtures">
              <template v-if="fixture.group === group">
                <tr>
                  <td class="border" :class="{ 'border-green-600 bg-green-100': isWinner(fixture.match, fixture.home) }">
                    <label class="block h-full w-full p-2">
                      {{ fixture.home }}
                      <input
                        type="radio"
                        :name="`fixture_${fixture.match}`"
                        @change="highlightWinner($event, fixture.match.toFixed(), fixture.home)"
                        :checked="isWinner(fixture.match, fixture.home)"
                      />
                    </label>
                  </td>
                  <td class="border p-2">vs</td>
                  <td class="border" :class="{ 'border-green-600 bg-green-100': isWinner(fixture.match, fixture.away) }">
                    <label class="block h-full w-full p-2">
                      {{ fixture.away }}
                      <input
                        type="radio"
                        :name="`fixture_${fixture.match}`"
                        @change="highlightWinner($event, fixture.match.toFixed(), fixture.away)"
                        :checked="isWinner(fixture.match, fixture.away)"
                      />
                    </label>
                  </td>
                  <td class="border" :class="{ 'border-green-600 bg-green-100': isWinner(fixture.match, 'draw') }">
                    <label class="block h-full w-full p-2">
                      Draw
                      <input
                        type="radio"
                        :name="`fixture_${fixture.match}`"
                        @change="highlightWinner($event, fixture.match.toFixed(), 'draw')"
                        :checked="isWinner(fixture.match, 'draw')"
                      />
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="border p-2">{{ fixture.date }} At {{ fixture.location }}</td>
                </tr></template
              >
            </template>
          </tbody>
        </table>
        <table class="mt-8 w-full border-separate">
          <caption class="text-xl">
            Points
          </caption>
          <thead>
            <tr>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-lg" v-for="country in data.teams">
              <td class="border text-left">{{ country }}</td>
              <td class="border">{{ points.get(country) ?? 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button
      type="button"
      class="sticky right-2 bottom-2 ml-auto block rounded-md border-2 border-gray-800 bg-gray-200 px-4 py-2 text-lg hover:border-gray-600 hover:bg-gray-300 focus:border-gray-600 focus:bg-gray-300"
    >
      Export
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Groups, Fixtures, Tournament } from '../types';
import { reactive, watch } from 'vue';

const winnerClasses = ['border-green-600', 'bg-green-100'];
const params = new URLSearchParams(window.location.search);
let storedResults = {};

if (params.has('results')) {
  const urlResults = params.get('results');
  if (urlResults) {
    storedResults = JSON.parse(window.atob(urlResults));
  }
}

const results = reactive<{ [match: string]: string }>({});
const points = reactive(new Map<string, number>());
const groups = reactive<Groups>({});
const teams = reactive<string[]>([]);
const fixtures = reactive<Fixtures>({});

(async () => {
  const tournament = params.get('tournament');
  const response = await fetch(`/tournament-brackets/${tournament}.json`);
  const data: Tournament = await response.json();
  Object.assign(groups, data.groups);
  teams.push(...data.teams);
  Object.assign(fixtures, data.fixtures);
  if (storedResults) {
    Object.assign(results, storedResults);
  }
})();

const highlightWinner = (event: Event, fixtureNum: string, winner: string) => {
  const target = event.target as HTMLInputElement;
  const parent = target.closest('td');
  const row = parent?.closest('tr');
  if (row?.childNodes) {
    row.childNodes.forEach((child) => {
      if (child.nodeName.toLowerCase() === 'td') {
        (child as HTMLTableCellElement).classList.remove(...winnerClasses);
      }
    });
  }
  parent?.classList.add(...winnerClasses);
  results[fixtureNum] = winner;
};

const isWinner = (match: number, team: string) => {
  return results[match.toFixed()] === team;
};

watch(results, (newValue, oldValue) => {
  points.clear();
  for (const match in newValue) {
    const winner = results[match];
    if (winner === 'draw') {
      const fixture = fixtures[match];
      if (fixture.home) {
        const home = points.get(fixture.home);
        if (home) {
          points.set(fixture.home, home + 1);
        } else {
          points.set(fixture.home, 1);
        }
      }
      if (fixture.away) {
        const curPoints = points.get(fixture.away);
        if (curPoints) {
          points.set(fixture.away, curPoints + 1);
        } else {
          points.set(fixture.away, 1);
        }
      }
    } else {
      const curPoints = points.get(winner);
      if (curPoints) {
        points.set(winner, curPoints + 3);
      } else {
        points.set(winner, 3);
      }
    }
  }
  const state = window.btoa(JSON.stringify(newValue));
  console.log(state);
  const newUrl = new URL(document.URL);
  newUrl.searchParams.set('results', state);
  window.history.replaceState({}, '', newUrl.toString());
});
</script>

<style></style>
