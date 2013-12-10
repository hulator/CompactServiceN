
(function(){
    module.exports = {
        unitID : 0,
        numerator: 0,
        hardwareVersion: 0,
        softwareVersion: "",
        transMissionReason : 0,
        mileage : 0,
        numberOfSatellites: 0,
        longitude: 0.0,
        latitude: 0.0,
        speed: 0.0,
        direction: 0,
        gpsDate: new Date(),
        
        encode: function(data){
            this.unitID = data.readInt32LE(5);
            this.numerator = data.readUInt8(11);
            this.hardwareVersion = data.readInt8(12);
            this.softwareVersion = data.readInt8(13);
            this.transMissionReason = data.readInt8(18);
            this.mileage = data.readInt8(29) + data.readInt8(30) * 256 + data.readInt8(31) * 256 * 256;
            this.numberOfSatellites = data.readInt8(43);
            this.longitude = data.readInt32LE(44) * 1E-8 * 180 / Math.PI;
            this.latitude = data.readInt32LE(48) * 1E-8 * 180 / Math.PI;
            this.speed = data.readInt32LE(56) * 3.6 / 100;
            this.direction = data.readInt16LE(60) / 1000;
            this.gpsDate = new Date(data.readInt16LE(67), data.readInt8(66) - 1, data.readInt8(65), data.readInt8(64), data.readInt8(63), data.readInt8(62), 0);
            }
    };
}());