(function(){
    module.exports = {   
        encode: function(unitID, numerator){
            var outBuffer = new Buffer(28);
            outBuffer.fill(0);
            outBuffer.write("MCGP", 0, 4, 'utf-8');
            outBuffer.writeInt8(4, 4);
            outBuffer.writeInt32LE(unitID, 5);
            outBuffer.writeUInt8(numerator, 15);
            

            return this.addCheckSum(outBuffer);
            },
        addCheckSum: function(buffer){
            var chk = 0;

            for (var i = 4; i < 27; i++){
                chk += buffer.readUInt8(i);
                }
            
            buffer.writeUInt8(chk % 256, 27);
            
            return buffer;
            }
    };
}());