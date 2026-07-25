import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
import ShopStatusToggle from "./storefront/ShopStatusToggle";

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipcode] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [website, setWebsite] = useState("");
  const [businessStatus, setBusinessStatus] = useState("open");
  const [themeAccent, setThemeAccent] = useState("#29625d");
  const [businessHours, setBusinessHours] = useState({});
  const [socialLinks, setSocialLinks] = useState({});
  const [policies, setPolicies] = useState({});
  const [gallery, setGallery] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!seller) return;
    setName(seller.name || "");
    setDescription(seller.description || "");
    setBio(seller.bio || "");
    setAddress(seller.address || "");
    setPhoneNumber(seller.phoneNumber || "");
    setZipcode(seller.zipCode || "");
    setPaymentInfo(seller.paymentInfo || "");
    setWebsite(seller.website || "");
    setBusinessStatus(seller.businessStatus || "open");
    setThemeAccent(seller.themeAccent || "#29625d");
    setBusinessHours(seller.businessHours || {});
    setSocialLinks(seller.socialLinks || {});
    setPolicies(seller.policies || {});
    setGallery(seller.gallery || []);
  }, [seller]);

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFile(file);
    await axios.put(`${server}/shop/update-shop-avatar`, { avatar: dataUrl }, { withCredentials: true });
    dispatch(loadSeller());
    toast.success("Logo updated");
  };

  const uploadCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFile(file);
    await axios.put(`${server}/shop/update-shop-cover`, { cover: dataUrl }, { withCredentials: true });
    dispatch(loadSeller());
    toast.success("Cover image updated");
  };

  const uploadGallery = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const items = await Promise.all(
      files.map(async (file) => ({
        image: await readFile(file),
        caption: "",
        type: "storefront",
      }))
    );
    const merged = [...gallery, ...items.map((i) => ({ ...i, url: null }))];
    await axios.put(`${server}/shop/update-shop-gallery`, { gallery: merged }, { withCredentials: true });
    dispatch(loadSeller());
    toast.success("Gallery updated");
  };

  const updateStatus = (status) => {
    setBusinessStatus(status);
    dispatch(loadSeller());
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        `${server}/shop/update-seller-info`,
        {
          name,
          description,
          bio,
          address,
          zipCode,
          phoneNumber,
          paymentInfo,
          website,
          businessHours,
          socialLinks,
          policies,
          themeAccent,
        },
        { withCredentials: true }
      );
      dispatch(loadSeller());
      toast.success("Storefront updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const setHour = (day, field, value) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  if (!seller) {
    return <p className="text-center py-8 text-gray-500">Loading store settings…</p>;
  }

  return (
    <div className="yebone-fade-up space-y-6 p-1 max-w-3xl mx-auto">
      <div className="dashboard-section yebone-surface">
        <h2 className="font-Poppins text-xl font-semibold mb-2 dark:text-white">Storefront customization</h2>
        <p className="text-sm text-gray-500 mb-6">Changes appear instantly on your public shop profile.</p>

        {/* Business status */}
        <div className="vendor-form-section yebone-surface mb-6">
          <h3 className="font-semibold mb-2 dark:text-white">Business Status</h3>
          <p className="text-xs text-gray-500 mb-3">Updates instantly on your storefront and product pages.</p>
          <ShopStatusToggle
            shopId={seller._id}
            value={businessStatus}
            onChange={updateStatus}
          />
        </div>

        {/* Cover + logo */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border dark:border-gray-700">
          <div className="aspect-[16/9] bg-gradient-to-br from-yebone-primary to-yebone-primary-dark relative">
            {seller.cover?.url && (
              <img src={seller.cover.url} alt="" className="w-full h-full object-cover" />
            )}
            <label className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs cursor-pointer">
              Change cover
              <input type="file" accept="image/*" className="hidden" onChange={uploadCover} />
            </label>
          </div>
          <div className="absolute left-6 -bottom-10">
            <img
              src={seller.avatar?.url}
              alt="Shop logo"
              className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg"
            />
            <label className="absolute bottom-0 right-0 bg-yebone-primary rounded-full p-2 cursor-pointer shadow">
              <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
              <AiOutlineCamera className="text-white" size={16} />
            </label>
          </div>
        </div>
        <div className="h-12" aria-hidden="true" />

        <form className="space-y-6" onSubmit={updateHandler}>
          <div className="vendor-form-section yebone-surface space-y-4">
            <h3 className="font-semibold dark:text-white">Brand</h3>
            <label className="block text-sm font-medium">Shop name</label>
            <input className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} value={name} onChange={(e) => setName(e.target.value)} required />
            <label className="block text-sm font-medium">Short bio</label>
            <textarea className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f] min-h-[80px]`} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A brief tagline for your storefront hero" />
            <label className="block text-sm font-medium">Full description</label>
            <textarea className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f] min-h-[100px]`} value={description} onChange={(e) => setDescription(e.target.value)} />
            <label className="block text-sm font-medium">Theme accent</label>
            <input type="color" value={themeAccent} onChange={(e) => setThemeAccent(e.target.value)} className="h-10 w-20 rounded cursor-pointer" aria-label="Theme accent color" />
          </div>

          <div className="vendor-form-section yebone-surface space-y-4">
            <h3 className="font-semibold dark:text-white">Contact</h3>
            <input className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} placeholder="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            <input className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} placeholder="Zip code" value={zipCode} onChange={(e) => setZipcode(e.target.value)} required />
            <input className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} placeholder="Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <input className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} placeholder="Payment info" value={paymentInfo} onChange={(e) => setPaymentInfo(e.target.value)} />
          </div>

          <div className="vendor-form-section yebone-surface space-y-4">
            <h3 className="font-semibold dark:text-white">Opening hours</h3>
            {DAY_KEYS.map((day, i) => (
              <div key={day} className="grid grid-cols-3 gap-2 items-center text-sm">
                <span>{DAY_LABELS[i]}</span>
                <input type="time" className={`${styles.input} rounded-lg dark:bg-[#1f1f1f]`} value={businessHours[day]?.open || ""} onChange={(e) => setHour(day, "open", e.target.value)} />
                <input type="time" className={`${styles.input} rounded-lg dark:bg-[#1f1f1f]`} value={businessHours[day]?.close || ""} onChange={(e) => setHour(day, "close", e.target.value)} />
              </div>
            ))}
          </div>

          <div className="vendor-form-section yebone-surface space-y-4">
            <h3 className="font-semibold dark:text-white">Policies</h3>
            <textarea className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} placeholder="Return policy" value={policies.returns || ""} onChange={(e) => setPolicies((p) => ({ ...p, returns: e.target.value }))} />
            <textarea className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} placeholder="Shipping policy" value={policies.shipping || ""} onChange={(e) => setPolicies((p) => ({ ...p, shipping: e.target.value }))} />
            <input className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`} placeholder="Support hours" value={policies.supportHours || ""} onChange={(e) => setPolicies((p) => ({ ...p, supportHours: e.target.value }))} />
          </div>

          <div className="vendor-form-section yebone-surface space-y-4">
            <h3 className="font-semibold dark:text-white">Social links</h3>
            {["instagram", "facebook", "twitter", "tiktok", "whatsapp"].map((key) => (
              <input
                key={key}
                className={`${styles.input} w-full rounded-xl dark:bg-[#1f1f1f]`}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={socialLinks[key] || ""}
                onChange={(e) => setSocialLinks((s) => ({ ...s, [key]: e.target.value }))}
              />
            ))}
          </div>

          <div className="vendor-form-section yebone-surface space-y-4">
            <h3 className="font-semibold dark:text-white">Gallery</h3>
            <label className="inline-flex px-4 py-2 rounded-xl border cursor-pointer text-sm font-medium">
              Upload photos
              <input type="file" accept="image/*" multiple className="hidden" onChange={uploadGallery} />
            </label>
            {gallery.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {gallery.map((item, i) => (
                  <img key={i} src={item.url} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} className="w-full py-3 bg-yebone-primary text-white font-semibold rounded-xl disabled:opacity-50">
            {saving ? "Saving…" : "Save storefront"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
