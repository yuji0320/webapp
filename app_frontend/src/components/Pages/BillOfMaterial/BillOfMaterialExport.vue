<template>
  <span>
    <app-excel-download
      :fileName="fileName"
      @export-excel="exportFunction"
      class="ml-2"
      ref="export"
    ></app-excel-download>
  </span>
</template>

<script>
export default {
  title: "Bill of Material Export",
  name: "BillOfMaterialExport",
  props: {
    fileName: { required: true },
    // 親のモデル情報を取得する
    bomArray: { required: true }
  },
  data() {
    return {
      jsonData: {},
    }
  },
  methods: {
    exportFunction() {
      this.jsonData = this.bomArray.map(bom => {
        return {
          "Part Name": bom.name,
          "Manufacturer": bom.manufacturerAbbr, 
          "Standard/Form": bom.standard,
          "Unit Number": bom.unitNumber,
          "Drawing Number": bom.drawingNumber,
          "Material": bom.material,
          "Surface Treatment": bom.surfaceTreatment,
          "Qty": bom.amount,
          "Unit Price": bom.defaultCurrencyPrice,
          "Total": bom.totalDefaultCurrencyPrice,
          "desiredDeliveryDate": bom.desiredDeliveryDate,
          "Notes": bom.notes,
        }
      });
      this.$refs.export.onExport(this.jsonData);
    },
  }
}
</script>