/**
 *  Copyright 2016-2019 the original author or authors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.antheminc.oss.nimbus.domain.model.state.internal;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import com.antheminc.oss.nimbus.domain.model.state.ExecutionTxnContext;
import com.antheminc.oss.nimbus.domain.model.state.Notification;
import com.antheminc.oss.nimbus.domain.model.state.ParamEvent;
import com.antheminc.oss.nimbus.support.JustLogit;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Soham Chakravarti
 *
 */
@Getter @Setter @ToString
public class DefaultExecutionTxnContext implements ExecutionTxnContext {
	
	private String id;

	private final BlockingQueue<Notification<Object>> notifications = new LinkedBlockingQueue<>();
	private final List<ParamEvent> events = new ArrayList<>();
	private final static JustLogit LOG = new JustLogit();
	
	@Override
	public void addNotification(Notification<Object> notification) {
		try {
			getNotifications().put(notification);
		} catch (InterruptedException ex) {
			LOG.error(() -> "Failed to place notification event on queue with value: " + notification, ex);
			Thread.currentThread().interrupt();
		}	
	}

	
	@Override
	public void addEvent(ParamEvent event) {
		getEvents().add(event);
	}
}
