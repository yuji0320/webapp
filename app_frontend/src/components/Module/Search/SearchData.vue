<template>
  <v-expansion-panels v-model="panel" multiple>
    <v-expansion-panel key=1>
      <!-- 検索パネルヘッダー -->
      <v-expansion-panel-header>
        <template v-slot:default="{ open }">
          <v-row no-gutters>
            <v-col cols="4">Refine Search</v-col>
            <v-col
              cols="8"
              class="text--secondary"
            >
              <v-fade-transition leave-absolute>
                <!-- パネルOpen時表示文言 -->s
                <span v-if="open">
                  <slot name="search-data-header-open"></slot>
                </span>
                <!-- パネルClose時表示文言 -->
                <v-row
                  v-else
                  no-gutters
                  style="width: 100%"
                >
                  <slot name="search-data-header-close"></slot>
                </v-row>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
        <!-- アイコン -->
        <template v-slot:actions>
          <v-icon>search</v-icon>
        </template>
      </v-expansion-panel-header>
      <!-- 検索パネル表示 -->
      <v-expansion-panel-content>
        <v-row
          justify="space-around"
          no-gutters
        > 
          <!-- 検索内容スロット -->
          <!-- メイン検索項目 -->
          <v-col cols="12">
            <slot name="search-data-content"></slot>
          </v-col>
          <!-- 詳細表示ボタン -->
          <v-col cols="12" v-show="refineDetail">
            <div class="text-right">
              <v-btn
                text
                color="primary"
                class="mb-4"
                @click="expand = !expand"
              >
                more
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </div>
          </v-col>
          <!-- 詳細検索項目 -->
          <v-expand-transition>
            <v-col cols="12" v-show="expand">
              <slot name="search-data-content-sub"></slot>
            </v-col>
          </v-expand-transition>
          <!-- 絞り込み検索ボタン -->
          <v-col cols="12">
            <div class="text-right">
              <v-btn class="mr-4" @click="$emit('clearData')">
                Clear
              </v-btn>
              <v-btn @click="$emit('refine')" color="primary">
                Refine
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  data() {
    return {
      panel: [0],
      expand: false,
    };
  },
  props: {
    refineDetail:　{ required: false },
  }
}
</script>