<template>
  <div class="container mx-auto my-4 text-center">
    <h1 class="mb-8 text-4xl">World Cup 2022 Group Stage</h1>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      <div v-for="(fixtures, group) in groupMatches">
        <table class="w-full border-separate">
          <caption class="text-2xl">
            {{
              group
            }}
            matches
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
              <tr>
                <td class="border">
                  <label class="block h-full w-full p-2">
                    {{ fixture.home }}
                    <input type="radio" :name="`fixture_${fixture.matchNumber}`" @change="highlightWinner($event, fixture.matchNumber, fixture.home)" />
                  </label>
                </td>
                <td class="border p-2">vs</td>
                <td class="border">
                  <label class="block h-full w-full p-2">
                    {{ fixture.away }}
                    <input type="radio" :name="`fixture_${fixture.matchNumber}`" @change="highlightWinner($event, fixture.matchNumber, fixture.away)" />
                  </label>
                </td>
                <td class="border">
                  <label class="block h-full w-full p-2">
                    Draw
                    <input type="radio" :name="`fixture_${fixture.matchNumber}`" @change="highlightWinner($event, fixture.matchNumber, 'draw')" />
                  </label>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="border p-2">{{ fixture.date }} At {{ fixture.location }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="mt-16 w-full border-separate">
          <caption class="text-2xl">
            Points
          </caption>
          <thead>
            <tr>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-lg" v-for="country in groups[group]">
              <td class="border text-left">{{ country }}</td>
              <td class="border">{{ points.get(country) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import groupMatches from './group-matches';
import allFixtures from './all-fixtures';
import { reactive, watch } from 'vue';

/*
const groups = {
  'Group A': [{ Qatar: 0 }, { Ecuaror: 0 }, { Senegal: 0 }, { Netherlands: 0 }],
  'Group B': [{ England: 0 }, { Iran: 0 }, { USA: 0 }, { Wales: 0 }],
  'Group C': [{ Argentina: 0 }, { 'Saudi Arabia': 0 }, { Mexico: 0 }, { Poland: 0 }],
  'Group D': [{ France: 0 }, { Australia: 0 }, { Denmark: 0 }, { Tunisia: 0 }],
  'Group E': [{ Spain: 0 }, { 'Costa Rica': 0 }, { Germany: 0 }, { Japan: 0 }],
  'Group F': [{ Belgium: 0 }, { Canada: 0 }, { Morocco: 0 }, { Croatia: 0 }],
  'Group G': [{ Brazil: 0 }, { Serbia: 0 }, { Switzerland: 0 }, { Cameroon: 0 }],
  'Group H': [{ Portugal: 0 }, { Ghana: 0 }, { Uruguay: 0 }, { 'South Korea': 0 }],
};
*/

const groups = {
  'Group A': ['Qatar', 'Ecuador', 'Senegal', 'Netherlands'],
  'Group B': ['England', 'Iran', 'USA', 'Wales'],
  'Group C': ['Argentina', 'Saudi Arabia', 'Mexico', 'Poland'],
  'Group D': ['France', 'Australia', 'Denmark', 'Tunisia'],
  'Group E': ['Spain', 'Costa Rica', 'Germany', 'Japan'],
  'Group F': ['Belgium', 'Canada', 'Morocco', 'Croatia'],
  'Group G': ['Brazil', 'Serbia', 'Switzerland', 'Cameroon'],
  'Group H': ['Portugal', 'Ghana', 'Uruguay', 'South Korea'],
};

const results = reactive(new Map<number, string>());
const points = reactive(new Map<string, number>());

const winnerClasses = ['border-green-600', 'bg-green-100'];

const highlightWinner = (event: Event, fixtureNum: number, winner: string) => {
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
  results.set(fixtureNum, winner);
};

watch(results, (newValue, oldValue) => {
  points.clear();
  newValue.forEach((winner, matchNumber) => {
    if (winner === 'draw') {
      const fixture = allFixtures.find((fixture) => matchNumber === fixture.MatchNumber);
      if (fixture?.HomeTeam) {
        const home = points.get(fixture?.HomeTeam);
        if (home) {
          points.set(fixture.HomeTeam, home + 1);
        } else {
          points.set(fixture.HomeTeam, 1);
        }
      }
      if (fixture?.AwayTeam) {
        const curPoints = points.get(fixture?.AwayTeam);
        if (curPoints) {
          points.set(fixture.AwayTeam, curPoints + 1);
        } else {
          points.set(fixture.AwayTeam, 1);
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
  });
});
</script>

<style></style>
