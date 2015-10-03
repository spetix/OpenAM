/**
 * The contents of this file are subject to the terms of the Common Development and
 * Distribution License (the License). You may not use this file except in compliance with the
 * License.
 *
 * You can obtain a copy of the License at legal/CDDLv1.0.txt. See the License for the
 * specific language governing permission and limitations under the License.
 *
 * When distributing Covered Software, include this CDDL Header Notice in each file and include
 * the License file at legal/CDDLv1.0.txt. If applicable, add the following below the CDDL
 * Header, with the fields enclosed by brackets [] replaced by your own identifying
 * information: "Portions copyright [year] [name of copyright owner]".
 *
 * Portions copyright 2015 ForgeRock AS.
 */


  /*global define */

define("org/forgerock/openam/ui/user/UserModel", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractModel",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/util/Constants",
    "org/forgerock/commons/ui/common/main/EventManager",
    "org/forgerock/openam/ui/common/util/RealmHelper",
    "org/forgerock/commons/ui/common/main/Router",
    "org/forgerock/commons/ui/common/main/ServiceInvoker"
], function ($, _, AbstractModel, Configuration, Constants, EventManager, RealmHelper, Router, ServiceInvoker) {
    var UserModel = AbstractModel.extend({
        idAttribute: "id",

        url:    Constants.host + "/" + Constants.context + "/json/" +
                RealmHelper.decorateURIWithRealm("__subrealm__/users"),

        sync: function (method, model, options) {
            var clearPassword = _.bind(function () {
                delete this.currentPassword;
                this.unset("password");
                return this;
            }, this);

            if (method === "update" || method === "patch") {
                if (_.has(this.changed, "password")) {
                    // password changes have to occur via a special rest call
                    return ServiceInvoker.restCall({
                        url: this.url + "/" + this.id + "?_action=changePassword",
                        type: "POST",
                        data: JSON.stringify({
                            username: this.get("id"),
                            currentpassword: this.currentPassword,
                            userpassword: this.get("password")
                        })
                    }).then(clearPassword, clearPassword);
                } else {
                    // overridden implementation for AM, due to the failures which would result
                    // if unchanged attributes are included along with the request
                    return ServiceInvoker.restCall(_.extend(
                        {
                            "type": "PUT",
                            "data": JSON.stringify(
                                _.pick(this.toJSON(), ["givenName","sn","mail","postalAddress","telephoneNumber"])
                            ),
                            "url": this.url + "/" + this.id,
                            "headers": {
                                "If-Match": this.getMVCCRev()
                            }
                        },
                        options
                    ));
                }
            } else {
                // defer to generic crest implementation
                return AbstractModel.prototype.sync.call(this, method, model, options);
            }
        },
        parse: function (response, options) {
            var user = {};

            delete response.userPassword;

            // many keys in response have single-element arrays for each property;
            // translate these into a simpler map object, when possible
            _.each(_.keys(response), function (property) {
                if (_.isArray(response[property]) && response[property].length === 1) {
                    user[property] = response[property][0];
                } else {
                    user[property] = response[property];
                }
            });

            if (!_.has(user, "roles")) {
                user.roles = [];
            } else if (_.isString(user.roles)) {
                user.roles = user.roles.split(",");
            }

            if (_.indexOf(user.roles, "ui-user") === -1) {
                user.roles.push("ui-user");
            }

            return user;
        },
        getProfile: function (headers) {
            return ServiceInvoker.restCall({
                url: this.url + "?_action=idFromSession",
                type: "POST",
                errorsHandlers: { "serverError": { status: "503" }, "unauthorized": { status: "401" } }
            }).then(
                _.bind(function (data) {
                    Configuration.globalData.auth.successURL = data.successURL;
                    Configuration.globalData.auth.fullLoginURL = data.fullLoginURL;
                    Configuration.globalData.auth.subRealm = data.realm.slice(1);

                    // keep track of the current realm as a future default value, following logout:
                    Router.configuration.routes.login.defaults[0] = data.realm;
                    this.set("id",data.id);
                    return this.fetch().then(_.bind(function () {
                        return this;
                    }, this));
                }, this)
            );
        },
        getProtectedAttributes: function () {
            return ["password"].concat(Configuration.globalData.protectedUserAttributes);
        },
        setCurrentPassword: function (currentPassword) {
            this.currentPassword = currentPassword;
        }
    });
    return new UserModel();
});