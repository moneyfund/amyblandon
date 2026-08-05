import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedAdminRoute from '../components/admin/ProtectedAdminRoute';
import AdminLayout from '../layouts/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';
import {
  ContentAdmin,
  Dashboard,
  AdminProperties,
  InquiriesAdmin,
  PropertyEditor,
  SettingsAdmin,
} from '../pages/admin/AdminPages';
import AdminLogin from '../pages/admin/AdminLogin';
import { ComingSoon, Unauthorized } from '../pages/admin/AdminUtilityPages';
import Home from '../pages/public/Home';
import Properties from '../pages/public/Properties';
import PropertyDetail from '../pages/public/PropertyDetail';
import MapView from '../pages/public/MapView';
import Insurance from '../pages/public/Insurance';
import InsuranceQuote from '../pages/public/InsuranceQuote';
import SellWithAmy from '../pages/public/SellWithAmy';
import { RealEstate, Resources, Article, Contact, NotFound } from '../pages/public/BasicPages';
import About from '../pages/public/About';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Navigate to="/admin/login" replace />} />
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin/unauthorized" element={<Unauthorized />} />

      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="propiedades" element={<Properties />} />
        <Route path="properties" element={<Navigate to="/propiedades" replace />} />
        <Route path="properties/:slug" element={<PropertyDetail />} />
        <Route path="map" element={<MapView />} />
        <Route path="real-estate" element={<RealEstate />} />
        <Route path="sell-with-amy" element={<SellWithAmy />} />
        <Route path="seguros" element={<Insurance />} />
        <Route path="insurance" element={<Navigate to="/seguros" replace />} />
        <Route path="insurance/quote" element={<InsuranceQuote />} />
        <Route path="sobre-mi" element={<About />} />
        <Route path="about" element={<Navigate to="/sobre-mi" replace />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/:slug" element={<Article />} />
        <Route path="contacto" element={<Contact />} />
        <Route path="contact" element={<Navigate to="/contacto" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<ProtectedAdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="properties/new" element={<PropertyEditor />} />
          <Route path="properties/:id/edit" element={<PropertyEditor />} />
          <Route path="content" element={<ContentAdmin />} />
          <Route path="inquiries" element={<InquiriesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="clients" element={<ComingSoon title="Gestión de clientes" />} />
          <Route path="property-leads" element={<ComingSoon title="Captación de propiedades" />} />
          <Route path="valuations" element={<ComingSoon title="Avalúos de propiedades" />} />
        </Route>
      </Route>
    </Routes>
  );
}
