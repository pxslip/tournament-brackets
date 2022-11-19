<script setup lang="ts">
import groupMatches from './group-matches';

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
  'Group A': ['Qatar', 'Ecuaror', 'Senegal', 'Netherlands'],
  'Group B': ['England', 'Iran', 'USA', 'Wales'],
  'Group C': ['Argentina', 'Saudi Arabia', 'Mexico', 'Poland'],
  'Group D': ['France', 'Australia', 'Denmark', 'Tunisia'],
  'Group E': ['Spain', 'Costa Rica', 'Germany', 'Japan'],
  'Group F': ['Belgium', 'Canada', 'Morocco', 'Croatia'],
  'Group G': ['Brazil', 'Serbia', 'Switzerland', 'Cameroon'],
  'Group H': ['Portugal', 'Ghana', 'Uruguay', 'South Korea'],
};

const highlightWinner = (event: Event, first: string, second?: string) => {
  const target = event.target as HTMLInputElement;
  const parent = target.closest('td');
  const row = parent?.closest('tr');
  if (row?.childNodes) {
    row.childNodes.forEach((child) => {
      if (child.nodeName.toLowerCase() === 'td') {
        (child as HTMLTableCellElement).classList.remove('border-green-600');
      }
    });
  }
  parent?.classList.add('border-green-600');
  if (first && second) {
    // this is a draw, find both
  }
};
</script>

<template>
  <div class="container mx-auto my-4 text-center">
    <h1 class="mb-8 text-4xl">World Cup 2022 Group Stage</h1>
    <div class="grid grid-cols-2 gap-4">
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
                <td class="border p-2">
                  {{ fixture.home }}
                  <input type="radio" :name="`fixture_${fixture.matchNumber}`" @change="highlightWinner($event, fixture.home)" />
                </td>
                <td class="border p-2">vs</td>
                <td class="border p-2">
                  {{ fixture.away }}
                  <input type="radio" :name="`fixture_${fixture.matchNumber}`" @change="highlightWinner($event, fixture.away)" />
                </td>
                <td class="border p-2">
                  Draw
                  <input type="radio" :name="`fixture_${fixture.matchNumber}`" @change="highlightWinner($event, fixture.home, fixture.away)" />
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
              <td class="border pl-2 text-left">{{ country }}</td>
              <td class="rounded-sm border-2 shadow-inner" contenteditable="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style></style>
