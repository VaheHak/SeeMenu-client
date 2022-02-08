import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import _ from 'lodash';

export default function generateZip(arr, order) {
  if (arr.length) {
    const zip = JSZip();
    _.map(arr, (element, i) => {
      zip.file(`images/table_${Object.keys(order?.tables)[i] ? Object.keys(order?.tables)[i] : 'Table'}.png`, element, {
        binary: true,
      });
    });
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, `${order.qrOrderRest?.name ? order.qrOrderRest?.name : 'Restaurant'} - ${order.id}.zip`);
    });
  }
}
