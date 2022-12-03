<template>
  <h1>{{ name }} - Knockout Stage</h1>
  <div class="grid grid-flow-col justify-around">
    <div v-for="fixtures in rounds" class="relative grid items-center justify-around gap-10">
      <div v-for="fixture in fixtures" class="grid grid-flow-row border text-center">
        <div class="border-b p-2">{{ actualTeam(fixture.home) }} <input type="radio" :name="`fixture_${fixture.match}`" value="home" v-model="results[fixture.match]" /></div>
        <div class="border-b p-2">vs</div>
        <div class="border-b p-2">{{ actualTeam(fixture.away) }} <input type="radio" :name="`fixture_${fixture.match}`" value="away" v-model="results[fixture.match]" /></div>
        <div class="p-2">{{ fixture.date }} At {{ fixture.location }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Fixtures, Tournament } from '../types';

const params = new URLSearchParams(window.location.search);

const knockoutFixtures = reactive<Fixtures>({});
const fixtures = reactive<Fixtures>({});

const name = ref<string>('');
const rounds = reactive<{ [round: number | string]: Fixtures }>({});
const results = reactive<{ [match: number]: 'home' | 'away' }>({});

if (params.has('tournament')) {
  (async () => {
    const tournament = params.get('tournament');
    const response = await fetch(`/${tournament}.json`);
    const data: Tournament = await response.json();
    Object.assign(fixtures, data.fixtures);
    for (const match in data.fixtures) {
      const fixture = data.fixtures[match];
      if (fixture.group === null) {
        knockoutFixtures[match] = fixture;
        if (!rounds[fixture.round]) {
          rounds[fixture.round] = {};
        }
        rounds[fixture.round][match] = fixture;
      }
    }
    name.value = data.name;
    const resultsData = params.get('results');
    if (resultsData) {
      const storedResults = JSON.parse(window.atob(resultsData));
      Object.assign(results, storedResults);
    }
  })();
}

watch(results, (newValue) => {
  const state = window.btoa(JSON.stringify(newValue));
  console.log(state);
  const newUrl = new URL(document.URL);
  newUrl.searchParams.set('results', state);
  window.history.replaceState({}, '', newUrl.toString());
});

const actualTeam = (team: string): string => {
  if (team) {
    let loser = false;
    if (team.startsWith('L_')) {
      loser = true;
      team = team.replace('L_', '');
    }
    const parsed = parseInt(team, 10);
    if (isNaN(parsed)) {
      // this is a team, return it
      return team;
    }
    let winner = results[parsed];
    if (loser) {
      winner = winner === 'home' ? 'away' : 'home';
    }
    return actualTeam(fixtures[parsed][winner]);
  }
  return '';
};
</script>
