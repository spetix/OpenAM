/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2009 Sun Microsystems Inc. All Rights Reserved
 *
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License). You may not use this file except in
 * compliance with the License.
 *
 * You can obtain a copy of the License at
 * https://opensso.dev.java.net/public/CDDLv1.0.html or
 * opensso/legal/CDDLv1.0.txt
 * See the License for the specific language governing
 * permission and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL
 * Header Notice in each file and include the License file
 * at opensso/legal/CDDLv1.0.txt.
 * If applicable, add the following below the CDDL Header,
 * with the fields enclosed by brackets [] replaced by
 * your own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 *
 * $Id: SSOServerMonConfig.java,v 1.2 2009/11/10 01:33:22 bigfatrat Exp $
 *
 */

/*
 * Portions Copyrighted 2011-2014 ForgeRock AS
 */
package com.sun.identity.monitoring;

public class SSOServerMonConfig {
    final int htmlPort;
    final int snmpPort;
    final int rmiPort;
    final int policyWindow;
    final int sessionWindow;
    final boolean monitoringEnabled;
    final boolean monHtmlPortEnabled;
    final boolean monRmiPortEnabled;
    final boolean monSnmpPortEnabled;
    final String monAuthFilePath;

    private SSOServerMonConfig (SSOServerMonInfoBuilder asib) {
        htmlPort = asib.htmlPort;
        snmpPort = asib.snmpPort;
        rmiPort = asib.rmiPort;
        monitoringEnabled = asib.monitoringEnabled;
        monHtmlPortEnabled = asib.monHtmlPortEnabled;
        monRmiPortEnabled = asib.monRmiPortEnabled;
        monSnmpPortEnabled = asib.monSnmpPortEnabled;
        monAuthFilePath = asib.monAuthFilePath;
        policyWindow = asib.policyWindow;
        sessionWindow = asib.sessionWindow;
    }

    public static class SSOServerMonInfoBuilder {
        int htmlPort;
        int snmpPort;
        int rmiPort;
        int policyWindow;
        int sessionWindow;
        boolean monitoringEnabled;
        boolean monHtmlPortEnabled;
        boolean monRmiPortEnabled;
        boolean monSnmpPortEnabled;
        String monAuthFilePath;

        public SSOServerMonInfoBuilder(boolean monEnabled) {
            monitoringEnabled = monEnabled;
        }

        public SSOServerMonInfoBuilder htmlPort(int htmlPrt) {
            htmlPort = htmlPrt;
            return this;
        }

        public SSOServerMonInfoBuilder snmpPort (int snmpPrt) {
            snmpPort = snmpPrt;
            return this;
        }

        public SSOServerMonInfoBuilder rmiPort (int rmiPrt) {
            rmiPort = rmiPrt;
            return this;
        }

        public SSOServerMonInfoBuilder monHtmlEnabled (boolean monHtmlEnabled) {
            monHtmlPortEnabled = monHtmlEnabled;
            return this;
        }

        public SSOServerMonInfoBuilder monRmiEnabled (boolean monRmiEnabled) {
            monRmiPortEnabled = monRmiEnabled;
            return this;
        }

        public SSOServerMonInfoBuilder monSnmpEnabled (boolean monSnmpEnabled) {
            monSnmpPortEnabled = monSnmpEnabled;
            return this;
        }

        public SSOServerMonInfoBuilder htmlAuthFile (String authFilePath)
        {
            monAuthFilePath = authFilePath;
            return this;
        }

        public SSOServerMonInfoBuilder policyWindowSize (int policyWindowSize) {
            policyWindow = policyWindowSize;
            return this;
        }

        public SSOServerMonInfoBuilder sessionWindowSize (int sessionWindowSize) {
            sessionWindow = sessionWindowSize;
            return this;
        }


        public SSOServerMonConfig build() {
            return new SSOServerMonConfig (this);
        }
    }
}

