package com.wecan.test.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * Database privileges
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Db implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId("Host")
    private String Host;

    @TableField("Db")
    private String Db;

    @TableField("User")
    private String User;

    @TableField("Select_priv")
    private String selectPriv;

    @TableField("Insert_priv")
    private String insertPriv;

    @TableField("Update_priv")
    private String updatePriv;

    @TableField("Delete_priv")
    private String deletePriv;

    @TableField("Create_priv")
    private String createPriv;

    @TableField("Drop_priv")
    private String dropPriv;

    @TableField("Grant_priv")
    private String grantPriv;

    @TableField("References_priv")
    private String referencesPriv;

    @TableField("Index_priv")
    private String indexPriv;

    @TableField("Alter_priv")
    private String alterPriv;

    @TableField("Create_tmp_table_priv")
    private String createTmpTablePriv;

    @TableField("Lock_tables_priv")
    private String lockTablesPriv;

    @TableField("Create_view_priv")
    private String createViewPriv;

    @TableField("Show_view_priv")
    private String showViewPriv;

    @TableField("Create_routine_priv")
    private String createRoutinePriv;

    @TableField("Alter_routine_priv")
    private String alterRoutinePriv;

    @TableField("Execute_priv")
    private String executePriv;

    @TableField("Event_priv")
    private String eventPriv;

    @TableField("Trigger_priv")
    private String triggerPriv;


}
