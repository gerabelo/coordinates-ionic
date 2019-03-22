var Ponto = /** @class */ (function () {
    function Ponto(id, lat, lng, status, typeId, files, userId) {
        this.files = [];
        this._id = id;
        this.lat = lat;
        this.lng = lng;
        this.status = status;
        this.typeId = typeId;
        this.files = files;
        this.userId = userId;
    }
    return Ponto;
}());
export { Ponto };
//# sourceMappingURL=ponto.js.map