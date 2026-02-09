const AddDistributor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async () => {
    await api.post("/admin/distributor", form);
    alert("Distributor Added");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-2xl">
      <h2 className="text-xl font-black mb-4">Add Distributor</h2>

      <input placeholder="Name" />
      <input placeholder="Email" />
      <input placeholder="Phone" />
      <input placeholder="Password" />

      <button onClick={handleSubmit}>Add Distributor</button>
    </div>
  );
};
