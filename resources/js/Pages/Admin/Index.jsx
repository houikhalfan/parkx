// resources/js/Pages/Admin/Parkx/Index.jsx
import AdminLayout from "@/Layouts/AdminLayout";

function ParkxIndex({ users }) {
  return (<div style={{ padding: 16 }}>
      <h1>ParkX Admin</h1>
      <p>It works 🎉</p>
    </div>);
}
ParkxIndex.layout = (page) => <AdminLayout children={page} />;
export default ParkxIndex;
