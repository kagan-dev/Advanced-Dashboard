import { SquareCheckBig, X } from "lucide-react";
import { useState, useEffect } from "react";

const UserDeviceModal = ({
  allDevices,
  userId,
  onClose,
  onSave,
  sensors,
  relays,
  organizations,
  boxes,
}) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedRelay, setSelectedRelay] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [updateFormData, setUpdateFormData] = useState({});

  const filteredBoxes = boxes.filter(
    (box) => box.organisationId === selectedOrganization?.id
  );

  useEffect(() => {
    if (selectedBox) {
      const updatedDevices = allDevices.filter(
        (device) => device.boxId === selectedBox.id
      );
      setFilteredDevices(updatedDevices);
    } else {
      setFilteredDevices([]); // Reset filtered devices when no box is selected
    }
  }, [allDevices, selectedBox]);

  useEffect(() => {
    if (selectedSensor) {
      setUpdateFormData({
        id: selectedSensor.id,
        name: selectedSensor.name || "",
        deviceTypeId: selectedSensor.deviceTypeId || null,
        topicStat: selectedSensor.topicStat || "",
        topicRec: selectedSensor.topicRec || "",
        topicRes: selectedSensor.topicRes || "",
        description: selectedSensor.description || "",
        boxId: selectedSensor.boxId || null,
        pin: selectedSensor.pin || "",
        active: selectedSensor.active || 0,
      });
    }
  }, [selectedSensor]);

  const handleOrganizationChange = (e) => {
    const orgId = Number(e.target.value);
    setSelectedOrganization(
      organizations.find((org) => org.id === orgId) || null
    );
    setSelectedBox(null);
    setSelectedRelay(null);
    setSelectedSensor(null);
    setFilteredDevices([]);
  };

  const handleBoxChange = (e) => {
    const boxId = Number(e.target.value);
    setSelectedBox(filteredBoxes.find((box) => box.id === boxId) || null);
    setSelectedRelay(null);
    setSelectedSensor(null);
    setFilteredDevices([]);
  };

  const handleRelayChange = (e) => {
    const relayId = Number(e.target.value);
    const relay = relays.find((r) => r.id === relayId) || null;
    setSelectedRelay(relay);
    setSelectedSensor(null);
    setSelectedDevice(relay);
  };

  const handleSensorChange = (e) => {
    const sensorId = Number(e.target.value);
    const sensor = sensors.find((s) => s.id === sensorId) || null;
    setSelectedSensor(sensor);
    setSelectedRelay(null);
    setSelectedDevice(sensor);
  };

  const handleSave = () => {
    if (selectedDevice) {
      const requestBody = {
        id: 0,
        userId: userId,
        deviceId: selectedDevice.id,
        deviceTypeId:
          selectedDevice.deviceTypeId || selectedRelay?.deviceTypeId,
        boxId: selectedBox?.id,
      };
      onSave(requestBody);
    } else {
      console.error("No device selected");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Add Device</h2>

        {/* Organization Selection */}
        <select
          className="select select-warning w-full mb-4"
          onChange={handleOrganizationChange}
          value={selectedOrganization?.id || ""}
        >
          <option disabled value="">
            Pick an organization
          </option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        {/* Box Selection */}
        <select
          className="select select-warning w-full mb-4"
          onChange={handleBoxChange}
          value={selectedBox?.id || ""}
          disabled={!selectedOrganization}
        >
          <option disabled value="">
            Pick a box
          </option>
          {filteredBoxes.map((box) => (
            <option key={box.id} value={box.id}>
              {box.name}
            </option>
          ))}
        </select>

        {/* Relay Selection */}
        <select
          className="select select-warning w-full mb-4"
          onChange={handleRelayChange}
          value={selectedRelay?.id || ""}
          disabled={!selectedBox}
        >
          <option disabled value="">
            Pick a relay
          </option>
          {relays
            .filter((relay) => relay.boxId === selectedBox?.id)
            .map((relay) => (
              <option key={relay.id} value={relay.id}>
                {relay.name}
              </option>
            ))}
        </select>

        {/* Sensor Selection */}
        <select
          className="select select-warning w-full"
          onChange={handleSensorChange}
          value={selectedSensor?.id || ""}
          disabled={!selectedBox}
        >
          <option disabled value="">
            Pick a sensor
          </option>
          {sensors
            .filter((sensor) => sensor.boxId === selectedBox?.id)
            .map((sensor) => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name}
              </option>
            ))}
        </select>

        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-error px-4 py-2 flex items-center gap-2"
          >
            <X />
            <span className="hidden sm:inline">Close</span>
          </button>
          <button
            onClick={handleSave}
            className="btn btn-outline btn-accent px-4 py-2 flex items-center gap-2"
          >
            <SquareCheckBig />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeviceModal;
