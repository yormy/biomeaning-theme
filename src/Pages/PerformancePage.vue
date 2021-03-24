<template>
  <div class="d-flex flex-column">

    <h1>{{$t('bedrock-core.performance.title')}}</h1>
    <p>
      <strong>{{from}} {{$t('bedrock-core.general.until')}} {{until}}</strong>
      <date-popup
        :from="from"
        :until="until"
        :dates.sync="dates"
      >
      </date-popup>
    </p>

    <div v-if="dateFrom">
      <button class="btn btn-primary" @click="setFilter(exclude)">
        {{$t('bedrock-core.general.filter')}}: {{dateFrom}}
        <span v-if="dateUntil"> {{$t('bedrock-core.general.until')}} {{dateUntil}}</span>
      </button>
    </div>

    <v-switch
      v-model="exclude"
      :label="$t('bedrock-core.performance.exclude_default_pages')"
      color="success"
      :readonly="true"
      @click="setFilter(!exclude)"
      hide-details
    ></v-switch>

    <div class="d-flex justify-content-between mt-3">
      <div class="flex-fill mx-3">
        <performance-card
          :title="pageAvgResponse + ' ms'"
          :subtitle="$t('bedrock-core.performance.statistics.average_page_response')"
        >
        </performance-card>
      </div>
      <div class="flex-fill mx-3">
        <performance-card
          :title="sqlAvgResponse + ' ms'"
          :subtitle="$t('bedrock-core.performance.statistics.average_sql_response')"
          :color="'bg-primary'"
        >
        </performance-card>
      </div>
    </div>


    <div class="my-3">
      <load-graph
        :title="$t('bedrock-core.performance.weighted_pages')"
        :labels="pageGraphLabels"
        :values="pageGraphValues"
      >
      </load-graph>
    </div>

    <div class="my-3">
      <load-graph
        :title="$t('bedrock-core.performance.weighted_sql')"
        :labels="sqlGraphLabels"
        :values="sqlGraphValues"
      >
      </load-graph>
    </div>

    <div class="d-flex justify-content-between my-3">
      <div class="flex-fill mx-3">
        <weighted-pages
          :title="$t('bedrock-core.performance.weighted_pages')"
          :values="pageWeightedAvg"
        ></weighted-pages>
      </div>
      <div class="flex-fill mx-3">
        <weighted-pages
          :title="$t('bedrock-core.performance.weighted_sql')"
          :values="sqlWeightedAvg"
        ></weighted-pages>
      </div>
    </div>

    <div class="d-flex justify-content-between my-3">
      <div class="flex-fill mx-3">
        <top-pages
          :title="$t('bedrock-core.performance.top_pages')"
          :values="pageUsage"
        ></top-pages>
      </div>
      <div class="flex-fill mx-3">
        <slow-pages
          :title="$t('bedrock-core.performance.slow_pages')"
          :values="pageSlow"
        ></slow-pages>
      </div>
    </div>

    <div class="d-flex justify-content-between my-3">
      <div class="flex-fill mx-3">
        <top-pages
          :title="$t('bedrock-core.performance.top_sql')"
          :values="sqlUsage"
        ></top-pages>
      </div>
      <div class="flex-fill mx-3">
        <slow-pages
          :title="$t('bedrock-core.performance.slow_sql')"
          :values="sqlSlow"
        ></slow-pages>
      </div>
    </div>

  </div>
</template>

<script>
import DatePopup from '../Inputs/DatePopup.vue';

export default {
  components : {
    DatePopup,
  },

  props: {
    from: {
      type: String,
      required: true,
    },

    until: {
      type: String,
      required: true,
    },

    exclude: {
      type: Boolean,
      default : false
    },

    pageAvgResponse: {
      type: String,
      required: true,
    },

    sqlAvgResponse: {
      type: String,
      required: true,
    },

    pageGraphLabels: {
      type: Array,
      required: true,
    },

    pageGraphValues: {
      type: Array,
      required: true,
    },

    sqlGraphLabels: {
      type: Array,
      required: true,
    },

    sqlGraphValues: {
      type: Array,
      required: true,
    },

    pageWeightedAvg: {
      type: Array,
      required: true,
    },

    sqlWeightedAvg: {
      type: Array,
      required: true,
    },

    pageUsage: {
      type: Array,
      required: true,
    },

    pageSlow: {
      type: Array,
      required: true,
    },

    sqlUsage: {
      type: Array,
      required: true,
    },

    sqlSlow: {
      type: Array,
      required: true,
    },

  },

  data() {
    return {
      dates: [],
      dateFrom: null,
      dateUntil: null,
    };
  },

  watch: {
    dates() {
      if (this.dates.length === 0) {
        this.dateFrom = null;
        this.dateUntil = null;
        return;
      }

      if (this.dates.length === 1) {
        this.dateFrom = this.dates[0];
        this.dateUntil = null;
        return;
      }

      this.dateFrom = this.dates[0];
      this.dateUntil = this.dates[1];
    },
  },

  methods: {
    setFilter(exclude) {
      let dateFrom = null
      let dateUntil = null;

      if (!this.dateFrom) {
        dateFrom = this.from.split(' ')[0];
        dateUntil = this.until.split(' ')[0];
      } else {
        dateFrom = this.dateFrom;
        dateUntil = this.dateUntil;
      }

      const url = this.route('admin.developer.performance.dashboard', {
        from: dateFrom,
        until: dateUntil,
        exclude: exclude,
      });

      window.location.href = url;
    },
  }
}
</script>
